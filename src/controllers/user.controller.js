import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { apiResponce } from '../utils/apiResponce.js';


const registerUser = asyncHandler(async (req, res) => {

   
    const { username, email, password, fullname } = req.body;


    if (!fullname || !username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }


    // if (!password) {
    //     throw new ApiError(400, "Password is required");
    // }
    // now we are checking if the user already exists
    const exisitingUser = await User.findOne({
        $or: [{ username }, { email }]
        // here the $or operator is used to check if either the username or email matches
    })

    if (exisitingUser) {
        throw new ApiError(409, "User already exists with this username or email");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath ;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    // what this above line does is:
    // it checks if req.files exists and has an avatar property
    // if it does, it accesses the first file in the avatar array
    // and then retrieves the path property of that file
    // this is a way to safely access nested properties without causing errors if any part of the chain is undefined

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOncloudinary(avatarLocalPath);
    const coverImage = await uploadOncloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Error uploading avatar image");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )// what .select does is to exclude the password and refreshToken fields from the returned user document
    // what findbyid does is to find the user by their unique identifier (_id) in the database

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(
        new apiResponce(201, createdUser, "User registered successfully")
    );// what this line does is:
    // it sends a JSON response with a status code of 201 (Created)
    // the response body is created using the apiResponce class
    // it includes a status code of 200, the createdUser data, and a success message
    // this indicates that the user registration was successful

    console.log("BODY RECEIVED:", req.body);

})



export { registerUser };

// simple thing we are giving a request on /api/v1/users
// form the app.js file
// so we wrote the code in app.js that if you get a request on /api/v1/users
// then use userRoutes to handle it and the userRoutes is pointing the request to the registerUser function in the user.controller.js file in the controllers folder
// so when we get a request on /api/v1/users/register
// it will go to the registerUser function in the user.controller.js file
// and the registerUser function will send a response with a message "hello you entred register user"


//sir-logic:
// get user details from frontend
// validation - not empty
// check if user already exists: username, email
// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return response

//my logic:
//for user registration steps
//s1 -get the data from the user like we asked in the user.model.js file
//s2-validate the data ❌ ai
//s3-check if the user already exists❌ ai
//s4-hash the password❌ ai
//s5-save the user to the database
//s6-send a response back to the client
