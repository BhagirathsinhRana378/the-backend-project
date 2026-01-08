import connectDB from "./db/index.js";
// import express from "express";
import dotenv from "dotenv";
import { app } from "./app.js";
 
// const app = express();

dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⛓️ Server is running on port :${process.env.PORT}`);
    });
})
// what is app.listen doing here?
// It starts the server and listens for incoming requests on the specified port.

.catch((err) => {
    console.log("MongoDB connection error:", err);
})
