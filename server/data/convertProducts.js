// convertProducts.js
import fs from "fs";

// Đọc file JSON cũ
const oldData = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

// Xử lý từng sản phẩm
const newData = oldData.map((product) => {
  const newProduct = { ...product };

  // Nếu có colors và size → tạo variants
  if (Array.isArray(product.colors) && Array.isArray(product.size)) {
    newProduct.variants = [];

    product.colors.forEach((color) => {
      product.size.forEach((size) => {
        newProduct.variants.push({
          color,
          size,
          stock: product.quantityInStock || 0 // tạm lấy stock chung cho tất cả biến thể
        });
      });
    });
  }

  // Xoá field cũ
  delete newProduct.colors;
  delete newProduct.size;
  delete newProduct.quantityInStock;

  return newProduct;
});

// Ghi file mới
fs.writeFileSync("./products_new.json", JSON.stringify(newData, null, 2), "utf-8");

console.log("✅ Đã tạo file products_new.json");
