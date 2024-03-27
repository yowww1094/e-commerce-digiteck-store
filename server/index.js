import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

import dbConnect from "./config/dbConnection.js";

import authRouter from "./routes/authRoutes.js";
import userRoutes from "./routes/authRoutes.js";

import {errorHandler, notFound} from "./middlewares/errorHandlers.js";


const PORT = process.env.PORT;

const app = express();

dbConnect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", authRouter);
app.use("/api", userRoutes);

app.get('/', (req, res)=>(
    res.status(200).json({message: "Hello World!"})
));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));