// routes/product.routes.ts - Example routes setup (adjust to your app structure)
import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "@/controller/product";
import { fileParser } from "@/middleware/fileparser";

const router = Router();

// Create - Use fileParser for multipart form
router.post("/", fileParser, addProduct);

// Read all
router.get("/", getProducts);

// Read one
router.get("/:id", getProductById);

// Update - Use fileParser if updating image
router.put("/:id", fileParser, updateProduct);

// Delete
router.delete("/:id", deleteProduct);

export default router;