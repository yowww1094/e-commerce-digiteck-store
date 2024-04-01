import { generateToken } from "../config/jsonWebTocken.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import validateMongodbid from "../utils/validateMongodbid.js";
import generateRefreshToken from "../config/refreshToken.js";
import jwt, { decode } from "jsonwebtoken"; 
import { connection } from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
    const email = req.body.email;

    const findUser = await User.findOne({email: email});
    if (!findUser) {
        const password = req.body.password;

        const newUser = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: password
        })
        res.json(newUser);

    }

    throw new Error("User already exists!");
})

const loginUser = asyncHandler(async (req, res) => {
    const email = req.body.email;

    const findUser = await User.findOne({email: email});
    if (findUser) {
        const password = req.body.password;
        const matchedPassword = findUser.isPasswordMatched(password);

        if (!matchedPassword) throw new Error("Invalide Credentials!");

        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUserRefreshToken = await User.findByIdAndUpdate(findUser?.id, {
            refreshToken: refreshToken,
        }, 
        {
            new: true,
        });

        if (!updateUserRefreshToken) throw new Error("Something went wrong!");

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })

        res.json({
            id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            role: findUser?.role,
            token: generateToken(findUser?._id),
        });
    }

    throw new Error("User does not exist!");
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const findAllUsers = await User.find();

        res.json(findAllUsers);
    } catch (error) {
        throw new Error(error);
    }
});

const getOneUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongodbid(id);
        const findOneUser = await User.findById(id);

        if(!findOneUser){
            throw new Error("User does not exist!");
        }

        res.json({
            id: findOneUser?._id,
            firstname: findOneUser?.firstname,
            lastname: findOneUser?.lastname,
            email: findOneUser?.email,
            role: findOneUser?.role
        });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbid(id);
    try {
        const findOneUser = await User.findByIdAndDelete(id);

        if(!findOneUser){
            throw new Error("User does not exist!");
        }

        res.json({
            id: findOneUser?._id,
            firstname: findOneUser?.firstname,
            lastname: findOneUser?.lastname,
            email: findOneUser?.email,
            role: findOneUser?.role
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbid(id);
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body.firstname,
            lastname: req?.body.lastname,
            email: req?.body.email,
            username: req?.body.username,
        },
        {
            new: true
        }
        );

        if(!updateUser){
            throw new Error("User does not exist!");
        }

        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const blockUser = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        },
        {
            new: true,
        })

        res.json(blockUser);
    } catch (error) {
        throw new Error(error);
    }
});

const unBlockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const unBlockUser = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        },
        {
            new: true,
        });

        res.json(unBlockUser);
    } catch (error) {
        throw new Error(error);
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie) throw new Error("Refresh Token not found!");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error("No Refresh Token is present!");

    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decode) => {
        if (err || user.id !== decode.id) throw new Error("Refresh Token not valide!");

        const accessToken = generateToken(user.id);
        res.json({ accessToken });
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in cookies!");
    const refreshToken = cookie.refreshToken;
    const user = User.findOne({refreshToken});
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(200);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(200);
});

export {
    registerUser,
    loginUser, 
    getAllUsers, 
    getOneUser, 
    deleteUser, 
    updateUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout,
};