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

const loginUser = async (req, res) => {

}

export {registerUser, loginUser};