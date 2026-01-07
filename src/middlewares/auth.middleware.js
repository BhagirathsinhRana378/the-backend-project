// what this middleware will do is to check if the user is authenticated or not
// if authenticated, it will allow the request to proceed
// if not, it will return a 401 Unauthorized response

import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJwtToken = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!User) {
            throw new ApiError(401, "Unauthorized: User not found");
        }
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }
});