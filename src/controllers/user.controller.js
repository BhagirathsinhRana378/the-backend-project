// JSON Web Token library – used to sign & verify tokens
import jwt from "jsonwebtoken";

// asyncHandler prevents try-catch pollution in every controller
import { asyncHandler } from "../utils/asyncHandler.js";

// Custom error class – keeps errors structured
import { ApiError } from "../utils/apiError.js";

// Custom response wrapper – keeps responses uniform
import { apiResponce } from "../utils/apiResponce.js";

// MongoDB User Model
import User from "../models/user.model.js";

// Cloudinary upload helper
import { uploadOncloudinary } from "../utils/cloudinary.js";

/* =======================================================
   ACCESS + REFRESH TOKEN GENERATOR
   -------------------------------------------------------
   PURPOSE:
   - Generates two tokens
   - Stores refresh token in DB
   - Ensures only ONE valid refresh token exists per user
======================================================== */
const generateJwtTokenAndRefreshToken = async (user) => {
    try {
        // Create access token using model method
        const accessToken = user.generateJwtToken();

        // Create refresh token using model method
        const refreshToken = user.generateRefreshToken();

        // Save refresh token inside database
        // This allows us to detect token reuse or theft
        user.refreshToken = refreshToken;

        // Skip validations like password hashing etc.
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

/* =======================================================
   REGISTER USER
======================================================== */
const registerUser = asyncHandler(async (req, res) => {

    // Extract all required fields from request body
    const { username, fullname, email, password } = req.body;

    // Stop request if any field missing
    if (!username || !fullname || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check DB if username OR email already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    // Read avatar file path safely using optional chaining
    const avatarPath = req.files?.avatar?.[0]?.path;

    if (!avatarPath) throw new ApiError(400, "Avatar is required");

    // Upload avatar image to Cloudinary
    const avatar = await uploadOncloudinary(avatarPath);

    // Upload cover image only if exists
    const coverImagePath = req.files?.coverImage?.[0]?.path;
    const coverImage = coverImagePath
        ? await uploadOncloudinary(coverImagePath)
        : null;

    // Create user in database
    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // Fetch created user WITHOUT sensitive fields
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res.status(201).json(
        new apiResponce(201, createdUser, "User registered successfully")
    );
});

/* =======================================================
   LOGIN USER
======================================================== */
const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    // User must provide either email OR username
    if (!email && !username) {
        throw new ApiError(400, "Username or email required");
    }

    // Find user by username OR email
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) throw new ApiError(404, "User not found");

    // Compare password with hashed password in DB
    const isValid = await user.isCorrectPassword(password);

    if (!isValid) throw new ApiError(401, "Invalid credentials");

    // Generate access & refresh tokens
    const { accessToken, refreshToken } =
        await generateJwtTokenAndRefreshToken(user);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    // Cookie settings
    const cookieOptions = {
        httpOnly: true,              // JS cannot access cookie
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",         // prevents CSRF
    };

    return res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new apiResponce(200, { user: loggedInUser }, "Login successful"));
});
const logoutUser = asyncHandler(async (req, res) => {

  // Step 1 — Remove refresh token from database
  // Why? Because whoever holds this token can generate new access tokens forever.
  // Clearing it immediately invalidates ALL existing sessions.
  await User.findByIdAndUpdate(
    req.user._id,
    {
      // $unset deletes the field completely from MongoDB
      $unset: { refreshToken: 1 }
    }
  );

  // Step 2 — Clear cookies from browser
  // httpOnly prevents JS access
  // secure ensures HTTPS only in production
  // sameSite blocks CSRF attacks
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  return res
    // Overwrites cookie with empty value and expires it
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new apiResponce(200, {}, "Logout successful"));
});

/* =======================================================
   REFRESH ACCESS TOKEN
======================================================== */
const refreshAccessToken = asyncHandler(async (req, res) => {

    // Token may come from cookie or request body
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken)
        throw new ApiError(401, "Unauthorized");

    // Decode refresh token using secret
    let decoded;
    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id);

    if (!user)
        throw new ApiError(404, "User not found");

    // If token mismatches → token reuse attack
    if (incomingRefreshToken !== user.refreshToken)
        throw new ApiError(401, "Refresh token expired or reused");

    // Rotate tokens – invalidate old refresh token
    const { accessToken, refreshToken } =
        await generateJwtTokenAndRefreshToken(user);

    // Cookie settings
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    return res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(200)
        .json(new apiResponce(200, {}, "Token refreshed"));
});

/* ======================================================= */

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
};
