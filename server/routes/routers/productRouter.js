import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  getTopAliases,
  uploadProductImages,
  resizeProductImages,
} from "../../controller/productController.js";
import { allowedTo, isAuth } from "../../middleware/auth.middleware.js";
import { USER_ROLES } from "../../constants/index.js";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../../validators/product.validator.js";
import reviewRouter from "./reviewRouter.js";

const router = express.Router();

// ✅ Middleware xử lý variants trực tiếp trong file router
const parseVariants = (req, res, next) => {
  if (req.body.variants && typeof req.body.variants === "string") {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch (err) {
      console.error("Failed to parse variants:", err.message);
      req.body.variants = [];
    }
  }

  if (!Array.isArray(req.body.variants)) {
    req.body.variants = [];
  }

  req.body.quantityInStock = req.body.variants.reduce(
    (sum, v) => sum + (Number(v.stock) || 0),
    0
  );

  next();
};

// NESTED ROUTES
router.use("/:productId/reviews", reviewRouter);

router.route("/top-rated").get(getTopAliases("-ratingAverage"), getAllProducts);
router.route("/top-sold").get(getTopAliases("-sold"), getAllProducts);
router.route("/top-sales").get(getTopAliases("-discount"), getAllProducts);
router.route("/new-arrivals").get(getTopAliases("-createdAt"), getAllProducts);

router
  .route("/")
  .get(getAllProducts)
  .post(
    isAuth,
    allowedTo(USER_ROLES.ADMIN),
    uploadProductImages,
    resizeProductImages,
    parseVariants,            // ✅ xử lý variants ở đây
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getSingleProduct)
  .patch(
    isAuth,
    allowedTo(USER_ROLES.ADMIN),
    uploadProductImages,
    resizeProductImages,
    parseVariants,            // ✅ xử lý variants ở đây
    updateProductValidator,
    updateSingleProduct
  )
  .delete(
    isAuth,
    allowedTo(USER_ROLES.ADMIN),
    deleteProductValidator,
    deleteSingleProduct
  );

export default router;
