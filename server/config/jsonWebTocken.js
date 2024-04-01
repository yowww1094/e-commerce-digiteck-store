import jwt from "jsonwebtoken";

const generateToken = (id) => {
    const secret_key = process.env.JWT_SECRET_KEY;
    return jwt.sign({id}, secret_key, { expiresIn: "1d" });
};

export {generateToken};