import express from "express";
import cors from "cors";
import "dotenv/config";

import dbConnect from "./config/dbConnection.js";
import authRouter from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import {errorHandler, notFound} from "./middlewares/errorHandlers.js";


const PORT = process.env.PORT;

const app = express();

dbConnect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", authRouter);

app.get('/', (req, res)=>(
    res.status(200).json({message: "Hello World!"})
));

app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));