import Cart from "../model/cartModel.js";
import Coupon from "../model/couponModel.js";
import Product from "../model/productModel.js";
import APIError from "../utils/apiError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

//_CALCULATE_TOTAL_CART_PRICE_//
export const calcCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterCouponDiscount = undefined;
};

// @desc    Get Logged User Cart
// @route   GET /api/cart
// @access  Protected
export const getMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "name image quantityInStock variants",
  });
  if (!cart) {
    return next(new APIError("There is no cart match this user", 404));
  }
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Add Product To Cart
// @route   PATCH /api/cart
// @access  Protected
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, size, color, quantity } = req.body;

  // 1) Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new APIError(`There is no product match this id: ${productId}`, 404));
  }

  // Find variant matching color & size
  const variant = product.variants.find((v) => v.color === color && v.size === size);
  if (!variant) {
    return next(new APIError(`No variant found matching color and size`, 400));
  }

  // Check requested quantity <= variant stock
  if (quantity > variant.stock) {
    return next(
      new APIError(`Số lượng(${quantity}) vượt quá số lượng tồn kho của mẫu này (${variant.stock})`, 400)
    );
  }

  // Calculate price with discount
  const priceWithDiscount = product.discount
    ? product.price - product.discount
    : product.price;

  // 2) Select the user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  // 3) Two scenarios: no cart or cart exists
  if (!cart) {
    // a) Create new cart
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, price: priceWithDiscount, size, color, quantity }],
    });
  } else {
    // b) Cart exists
    const productIdxInCart = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (productIdxInCart === -1) {
      // product variant not in cart, push new item
      cart.cartItems.push({
        product: productId,
        price: priceWithDiscount,
        size,
        color,
        quantity,
      });
    } else {
      // product variant already in cart, update quantity
      const cartItem = cart.cartItems[productIdxInCart];
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        return next(
          new APIError(
            `Adding this quantity exceeds variant stock (${variant.stock})`,
            400
          )
        );
      }

      cartItem.quantity = newQuantity;
      cart.cartItems[productIdxInCart] = cartItem;
    }
  }

  calcCartTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added successfully to cart",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Remove Product From Cart
// @route   PATCH /api/cart/:cartItemId
// @access  Protected
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.cartItemId } } },
    { new: true }
  );

  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }

  calcCartTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Update CartItem Quantity
// @route   PATCH /api/cart/:cartItemId
// @access  Protected
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { cartItemId } = req.params;

  if (!quantity || quantity < 1) {
    return next(new APIError("Please enter a valid quantity (>=1)", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");
  if (!cart) {
    return next(new APIError("There is no cart match this user", 404));
  }

  const cartItemIdx = cart.cartItems.findIndex((item) => item._id.toString() === cartItemId);
  if (cartItemIdx === -1) {
    return next(new APIError(`No cart item matches this id: ${cartItemId}`, 404));
  }

  const cartItem = cart.cartItems[cartItemIdx];
  const product = await Product.findById(cartItem.product._id);

  // Find variant in product
  const variant = product.variants.find(
    (v) => v.color === cartItem.color && v.size === cartItem.size
  );
  if (!variant) {
    return next(new APIError(`Variant not found for this cart item`, 400));
  }

  if (quantity > variant.stock) {
    return next(
      new APIError(`Số lượng (${quantity}) vượt quá số lượng tồn kho của mẫu này (${variant.stock})`, 400)
    );
  }

  cartItem.quantity = quantity;
  cart.cartItems[cartItemIdx] = cartItem;

  calcCartTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Clear All CartItems
// @route   DELETE /api/cart
// @access  Protected
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }
  cart.cartItems = [];
  calcCartTotalPrice(cart);
  await cart.save();
  res.status(204).json({ status: "success" });
});

// @desc    Apply Coupon Discount On Cart
// @route   PATCH /api/cart/apply-coupon
// @access  Protected
export const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode, productId } = req.body;

  // Check Coupon code is valid and not expired
  const coupon = await Coupon.findOne({
    name: couponCode,
    product: productId,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new APIError("Invalid or expired coupon", 404));
  }

  // Get user cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }

  // Calc Total Price before discount
  calcCartTotalPrice(cart);

  const cartItemIdx = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );
  if (cartItemIdx === -1) {
    return next(new APIError("Product with this id is not exist on your cart", 404));
  }

  const cartItemWillDiscount = cart.cartItems[cartItemIdx];
  const cartWithDiscount = cart.cartItems.map((item) => {
    if (item === cartItemWillDiscount) {
      return {
        ...item._doc,
        price: parseFloat((item.price - item.price * (coupon.discount / 100)).toFixed(2)),
      };
    } else {
      return item;
    }
  });

  // Calc Total Price after discount
  let totalPriceAfterDisc = 0;
  cartWithDiscount.forEach((item) => {
    totalPriceAfterDisc += item.price * item.quantity;
  });
  cart.totalPriceAfterCouponDiscount = totalPriceAfterDisc;

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
