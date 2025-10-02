import { Schema, model } from "mongoose";

export interface Product {
    name: string;
    price: number;
    description: string;
    image: { url: string; id: string };
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<Product>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        image: {
            url: { type: String, required: true },
            id: { type: String, required: true },
        },
    },
    { timestamps: true }
);

export const ProductModel = model<Product>("Product", productSchema);