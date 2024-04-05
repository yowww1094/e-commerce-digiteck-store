import mongoose, { Mongoose } from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    brand: {
        type: String,
        enum: ['Samsung','Apple','Lenovo','Huawei'],
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    image: {
        type: Array,
    },
    colors: {
        type: String,
        enum: ['Black','Green','Blue','Red'],
    },
    rating: [{
        type: Number,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }],

}, 
{timestamps: true});

export default mongoose.model("Product", productSchema);