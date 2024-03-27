import express from "express";

import {registerUser, loginUser, getAllUsers, getOneUser, deleteUser, updateUser} from "../controllers/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router(); 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/user/:id", getOneUser);
router.delete("/user/:id", deleteUser);
router.put("/user/:id", updateUser);

export default router;