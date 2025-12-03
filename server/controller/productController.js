import Product from "../model/productModel.js";
import {
  getAll,
  getOne,
  deleteOne,
} from "../utils/refactorControllers.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadMixOfImages } from "../middleware/imgUpload.middleware.js";
import sharp from "sharp";

//__________IMAGES_HANDLER__________//
// 1) UPLOADING(Multer)
export const uploadProductImages = uploadMixOfImages([
  { name: "image", maxCount: 1 },
  { name: "sliderImages", maxCount: 4 },
]);

// 2) PROCESSING(Sharp)
export const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  // a) main image
  if (req.files.image) {
    const mainImageFilename = `product-${req.user._id}-${Date.now()}-main.jpeg`;
    await sharp(req.files.image[0].buffer)
      .resize(800, 800)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${process.env.FILES_UPLOADS_PATH}/products/${mainImageFilename}`);
    req.body.image = mainImageFilename;
  }

  // b) slider images
  if (req.files.sliderImages) {
    req.body.sliderImages = [];
    await Promise.all(
      req.files.sliderImages.map(async (img, idx) => {
        const sliderImageName = `product-${req.user._id}-${Date.now()}-slide-${idx + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(800, 800)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${process.env.FILES_UPLOADS_PATH}/products/${sliderImageName}`);

        req.body.sliderImages.push(sliderImageName);
      })
    );
  }

  next();
});

// @desc    CREATE a Product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  // Parse variants nếu là string
  if (typeof req.body.variants === "string") {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch {
      req.body.variants = [];
    }
  }

  // Tính quantityInStock nếu có variants
  if (Array.isArray(req.body.variants)) {
    req.body.quantityInStock = req.body.variants.reduce(
      (sum, v) => sum + (Number(v.stock) || 0),
      0
    );
  }

  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @desc    GET All Products
// @route   GET /api/products
// @access  Public
export const getAllProducts = getAll(Product);

// @desc    GET Single Product
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = getOne(Product, "reviews");

// @desc    UPDATE Single Product
// @route   PATCH /api/products/:id
// @access  Private/Admin
export const updateSingleProduct = asyncHandler(async (req, res) => {
  // Parse variants nếu là string
  if (typeof req.body.variants === "string") {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch {
      req.body.variants = [];
    }
  }

  // Tính quantityInStock nếu có variants
  if (Array.isArray(req.body.variants)) {
    req.body.quantityInStock = req.body.variants.reduce(
      (sum, v) => sum + (Number(v.stock) || 0),
      0
    );
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json(product);
});

// @desc    DELETE Single Product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteSingleProduct = deleteOne(Product);

// @desc    GET Top Aliases
export const getTopAliases = (sortOption) => {
  return (req, res, next) => {
    req.query.limit = "7";
    req.query.sort = `${sortOption}`;
    req.query.fields =
      "name price image discount ratingAverage reviewsNumber quantityInStock";
    next();
  };
};
