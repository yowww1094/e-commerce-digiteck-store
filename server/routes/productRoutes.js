import express from "express";
import { createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "../controllers/productController.js";

import { authMiddleware, isAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default router;