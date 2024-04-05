import express from "express";
import { createProduct, getAllProducts, getOneProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getOneProduct);

export default router;