import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {

})

export {registerUser};

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
