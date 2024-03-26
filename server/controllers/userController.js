import { generateToken } from "../config/jsonWebTocken.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

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

        if (!matchedPassword) {
            throw new Error("Invalide Credentials!");
        }
        console.log({
            id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            role: findUser?.role,
            token: generateToken(findUser?._id),
        });

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

export {registerUser, loginUser, getAllUsers, getOneUser, deleteUser, updateUser};