import { Router } from "express";
import { loginUser, registerUser,logoutUser } from "../controllers/user.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/register").post(
    
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser);

router.route("/login").post(loginUser);
   
//secured routes
router.route("/logout").post(verifyJwtToken, logoutUser)

// middleware to handle file uploads
// here we are using upload.fields to handle multiple file uploads with different field names
// avatar and coverImage are the field names we are expecting from the frontend
// maxCount is the maximum number of files we are expecting for each field
// after the files are uploaded, multer will add a files object to the req object
export default router;
