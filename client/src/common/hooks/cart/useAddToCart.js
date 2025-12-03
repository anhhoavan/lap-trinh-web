import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../features/cart/cartServices";
import pushNotification from "../../components/Shared/Notification";

const useAddToCart = (product) => {
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [colorIdx, setColorIdx] = useState("");
  const [sizeIdx, setSizeIdx] = useState("");
  const [variantsQuantity, setVariantsQuantity] = useState({}); // key: "color-size" -> quantity

  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  // Color
  const handleSelectColor = (idx, colorSelected) => {
    setColor(colorSelected);
    setColorIdx(idx);
  };

  // Size
  const handleSelectSize = (idx, sizeSelected) => {
    setSize(sizeSelected);
    setSizeIdx(idx);
  };

  // Thay đổi số lượng cho biến thể hiện tại
  const handleQtyChange = (value) => {
    if (!color || !size) {
      pushNotification("Please select color and size first", "error");
      return;
    }
    const key = `${color}-${size}`;
    setVariantsQuantity((prev) => ({
      ...prev,
      [key]: Number(value) >= 0 ? Number(value) : 0,
    }));
  };

  const handleAddToCart = () => {
    if (product?.colors?.length !== 0 && !color) {
      pushNotification("Please select a color", "error");
      return;
    }
    if (product?.colors?.length !== 0 && !size) {
      pushNotification("Please select a size", "error");
      return;
    }

    const key = `${color}-${size}`;
    const variant = product.variants.find(
      (v) => v.color === color && v.size === size
    );

    if (!variant) {
      pushNotification("Variant not found", "error");
      return;
    }

    const quantity = variantsQuantity[key] ?? 1;

    if (!quantity || quantity <= 0) {
      pushNotification("Please enter a valid quantity", "error");
      return;
    }

    if (quantity > variant.stock) {
      pushNotification(
        `Quantity exceeds available stock (${variant.stock})`,
        "error"
      );
      return;
    }

    dispatch(
      addToCart({
        productId: product?._id,
        color,
        size,
        quantity,
      })
    );
  };

  return {
    colorIdx,
    sizeIdx,
    variantsQuantity,
    handleSelectColor,
    handleSelectSize,
    handleQtyChange,
    handleAddToCart,
    cartState,
  };
};

export default useAddToCart;
