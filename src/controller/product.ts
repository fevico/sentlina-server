// product.controller.ts - Complete CRUD handlers
import cloudinary from "@/cloud";
import { Product, ProductModel } from "@/model/product";
import { RequestHandler } from "express";
import { File } from "formidable";

export const addProduct: RequestHandler = async (req, res) => {
    try {
        // Validate required fields
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ error: "Name, price, and description are required" });
        }

        // Handle file upload if present
        let imageData: { url: string; id: string } | undefined;
        if (req.files && req.files.image) {
            const file = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
            if (!file || !file.filepath) {
                return res.status(400).json({ error: "Image file is required" });
            }

            // Upload to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload(
                    file.filepath,
                    { folder: "products" }, // Optional: Organize in a folder
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });

            imageData = {
                url: (uploadResult as any).secure_url,
                id: (uploadResult as any).public_id,
            };
        } else {
            return res.status(400).json({ error: "Image file is required" });
        }

        // Create product
        const product: Product = await ProductModel.create({
            name,
            price: parseFloat(price),
            description,
            image: imageData,
        });

        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProducts: RequestHandler = async (req, res) => {
    try {
        const products: Product[] = await ProductModel.find().sort({ createdAt: -1 });
        res.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProductById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const product: Product | null = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProduct: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        // Optional file upload for image update
        let imageData: { url: string; id: string } | undefined;
        if (req.files && req.files.image) {
            const file = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
            if (file && file.filepath) {
                // Delete old image from Cloudinary if exists
                const existingProduct = await ProductModel.findById(id);
                if (existingProduct && existingProduct.image.id) {
                    await new Promise((resolve, reject) => {
                        cloudinary.uploader.destroy(existingProduct.image.id, (error) => {
                            if (error) reject(error);
                            else resolve(null);
                        });
                    });
                }

                // Upload new image
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(
                        file.filepath,
                        { folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                });

                imageData = {
                    url: (uploadResult as any).secure_url,
                    id: (uploadResult as any).public_id,
                };
            }
        }

        // Update fields (only update provided ones)
        const updateData: Partial<Product> = {
            ...(req.body.name && { name: req.body.name }),
            ...(req.body.price && { price: parseFloat(req.body.price) }),
            ...(req.body.description && { description: req.body.description }),
            ...(imageData && { image: imageData }),
        };

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No fields provided to update" });
        }

        const updatedProduct: Product | null = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProduct: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const product: Product | null = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete image from Cloudinary
        if (product.image.id) {
            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(product.image.id, (error: any) => {
                    if (error) reject(error);
                    else resolve(null);
                });
            });
        }

        await ProductModel.findByIdAndDelete(id);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};