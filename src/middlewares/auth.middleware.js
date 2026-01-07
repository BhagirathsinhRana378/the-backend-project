// what this middleware will do is to check if the user is authenticated or not
// if authenticated, it will allow the request to proceed
// if not, it will return a 401 Unauthorized response
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
export const verifyJwtToken = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.replace("Bearer ", "");
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
        throw new ApiError(401, "Unauthorized: No token");
    }

    // ---- TRY ACCESS TOKEN ----
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id).select("-password -refreshTokens");

            if (!user) throw new ApiError(401, "Unauthorized");

            req.user = user;
            return next();
        } catch (err) {
            if (err.name !== "TokenExpiredError") {
                throw err;
            }
        }
    }

    // ---- FALLBACK TO REFRESH TOKEN ----
    if (!refreshToken) {
        throw new ApiError(401, "Session expired. Please login again.");
    }

    let decodedRefresh;
    try {
        decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Session expired. Please login again.");
    }

    const user = await User.findById(decodedRefresh._id);

    if (!user || user.refreshTokens !== refreshToken) {
        throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }

    req.user = user;
    next();
});
