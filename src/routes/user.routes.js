import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    upload.fields(                           //in fields multiple files can be given for upload in array form, each file comes as a object
        [
            {
                name: "avatar",
                maxCount: 1
            },
            {
                name: "coverImage",
                maxCount: 1
            }
        ]
    ),
    registerUser)


router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

export default router;