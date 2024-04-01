import express from "express";

import {
    registerUser, 
    loginUser, 
    getAllUsers, 
    getOneUser, 
    deleteUser, 
    updateUser, 
    blockUser, 
    unBlockUser, 
    handleRefreshToken, 
    logout
} from "../controllers/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router(); 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/user/:id", authMiddleware, isAdmin, getOneUser);
router.delete("/user/:id", authMiddleware, isAdmin, deleteUser);
router.put("/user/:id", authMiddleware, isAdmin, updateUser);
router.put("/user/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/user/unblock/:id", authMiddleware, isAdmin, unBlockUser);
router.put("/user/unblock/:id", authMiddleware, isAdmin, handleRefreshToken);
router.put("/user/unblock/:id", authMiddleware, isAdmin, logout);

export default router;