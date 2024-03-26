import express from "express";

import {registerUser, loginUser, getAllUsers, getOneUser, deleteUser, updateUser} from "../controllers/userController.js"; 

const router = express.Router(); 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getOneUser);
router.delete("/user/:id", deleteUser);
router.put("/user/:id", updateUser);

export default router;