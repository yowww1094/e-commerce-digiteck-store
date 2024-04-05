import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {

    if(!req.body.title) throw new Error("Product title not found!");
    req.body.slug = slugify(req.body.title); 

    try {
        const newProduct = await Product.create(req.body);

        if(!newProduct) throw new Error("Something went wrong!");

        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (error) {
        throw new Error(error);
    }
});

const getOneProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const oneProduct = await Product.findById(id);

        if(!oneProduct) throw new Error("Product not found!");

        res.json(oneProduct);
    } catch (error) {
        throw new Error(error);
    }
});

export {
    createProduct,
    getAllProducts,
    getOneProduct,
}