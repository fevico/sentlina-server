import { Schema } from "mongoose";

interface Product{
    name: string;
    price: number;
    description: string;
    image:  {url: string, id: string}
}

const productSchema = new Schema<Product>({
     
})