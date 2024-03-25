import mongoose from "mongoose";

const mongo_uri = process.env.MONGO_URI;

const dbConnect = () => {
    try {
        const conn = mongoose.connect(mongo_uri);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log(error);
    }
}

export default dbConnect;