import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
        
        token = req?.headers?.authorization.split(" ")[1];
        try {
            if (token) {
                const jwt_secret_ket = process.env.JWT_SECRET_KEY;
                const decoded = jwt.verify(token, jwt_secret_ket);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("Not authorizeed or token expired, Please login again!")
        }
    } else {
        throw new Error("Token not found!");
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const userAdmin = await User.findOne({email});

    if (userAdmin.role !== "admin") {
        throw new Error("You have no access!");
    }

    next();
});

export {authMiddleware, isAdmin};