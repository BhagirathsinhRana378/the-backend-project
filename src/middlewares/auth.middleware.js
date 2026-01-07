// what this middleware will do is to check if the user is authenticated or not
// if authenticated, it will allow the request to proceed
// if not, it will return a 401 Unauthorized response
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJwtToken = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;
    const token = req.cookies?.accessToken || authHeader?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized: Token missing");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select("-password -refreshTokens");

    if (!user) {
        throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
});
