import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
 res.status(200).json({message:"hello you entred register user" });
})

export {registerUser};

// simple thing we are giving a request on /api/v1/users
// form the app.js file
// so we wrote the code in app.js that if you get a request on /api/v1/users
// then use userRoutes to handle it and the userRoutes is pointing the request to the registerUser function in the user.controller.js file in the controllers folder
// so when we get a request on /api/v1/users/register
// it will go to the registerUser function in the user.controller.js file
// and the registerUser function will send a response with a message "hello you entred register user"