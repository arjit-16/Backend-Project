import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        //First have to find the user before generating tokens
        const user = await User.findById(userId);
        //Now generate access(given back to user) token and refresh token(save into database)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        //Save the refresh token into database
        user.refreshToken = refreshToken;
        await user.save();

        return {accessToken, refreshToken};

    } catch (error) {
        throw new Error("Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => { 
    // res.status(200).json({
    //     message: "ok"
    // })

    // STEPS FOR REGISTERING USER
   
    // get user details from frontend
    // validation - not empty
    // Check if user already exists---username,email
    // check for images, avatar(required)
    // upload them to cloudinary
    // create user object - create entry in db
    // send back a token to the frontend after removing password and removing refresh token
    // check for user creation
    // return response


    // user details from frontend
    const {userName, fullName, email, password} = req.body;                   
    console.log(email);

    if([userName, fullName, email, password].some((field)=>{
        return field?.trim() == ""
     })){
        return res.status(400).json({
            message: "Please fill in all fields"
    })}

    //check if user already exists
    const userExists = await User.findOne({
        $or: [{userName},{email}]
    })
    if(userExists){
        return res.status(400).json({
            message: "User already exists"
        })
    }

    //check for images, avatar(required)
    const avatarLocalPath = req.files?.avatar[0]?.path;       //.avatar is file name which always add multiple files in an array, therefore avatar[0] brings out its first file
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // console.log(req.files);
    
    if (!avatarLocalPath) {
        res.status(400).json({
            message: "Please provide an avatar"
        })
    }

    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        res.status(400).json({
            message: "Avatar file is required"
        })
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        res.status(500).json({
            message: "Something went wrong while registering user"
        })
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "user registered succesfully")
    )

})

const loginUser = asyncHandler( async (req, res) => {
    //STEPS TO DO FOR LOGIN USER
    // take data from req body
    // username or email
    // find the user
    // check for password(if it's correct or not)
    // access and refresh token
    // send cookies

    const {userName, email, password} = req.body;                   // step 1

    if(!(userName || email)){                                        // checking either email or username must be there 
        res.status(400).json({
            message: "username or email is required"
        })
    }

    const user = User.findOne({                                    // finding the user if either email or username matches
        $or: [{email},{userName}]
    })

    if (!user) {
        res.status(400).json({
            message: "user doesn't exist"
        })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)     
    if (!isPasswordValid) {
        res.status(400).json({
            message: "password is incorrect"
            })
        }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")    //optional step of what to send to user

    //sending cookies to user
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, loggedInUser, "user logged in successfully")
    )


})

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {   
            $set: {refreshToken: ""}
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options) 
    .json( new ApiResponse(200, {}, "User Logged Out Succesfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}