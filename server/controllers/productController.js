import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import validateMongodbid from "../utils/validateMongodbid.js";

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
        const queryObj = { ...req.query};
        const excludeField = ["page", "sort", "limit", "field"]
        excludeField.forEach((el) => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(".").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt")
        }

        //limiting fileds
        if (req.query.fields) {
            const fields = req.query.fields.split(".").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v")
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1 ) * limit;

        query = query.skip(skip).limit(limit);
        if(req.query.page) {
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("Page does not exists");
        }

        const allProducts = await query;
        res.json(allProducts);
    } catch (error) {
        throw new Error(error);
    }
});

const getOneProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbid(id);

    try {
        const oneProduct = await Product.findById(id);

        if(!oneProduct) throw new Error("Product not found!");

        res.json(oneProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbid(id);

    try {
        if(req?.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const product = await Product.findById(id);
        if(!product) throw new Error("Product not found!");

        const updateProduct = await Product.findByIdAndUpdate(id, {
            title: req?.body.title,
            slug: req?.body.slug,
            description: req?.body.description,
            categorie: req?.body.categorie,
            brand: req?.body.brand,
            colors: req?.body.colors,
            price: req?.body.price,
            quantity: req?.body.quantity,
        },{
            new: true,
        });

        if(!updateProduct) throw new Error("Something went wrong!");

        res.json(updateProduct);

    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbid(id);

    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct) throw new Error("Something went wrong!");

        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error);
    }
});

export {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
}