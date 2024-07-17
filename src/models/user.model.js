import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
{
      userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      avatar: {
        type: String,
        required: true
      },
      coverImage: {
        type: String
      },
      watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
      ],
      password: {
        type: String,
        required: [true, "Password is required"]
      },
      refreshToken: {
        type: String
      }

},{timestamps: true});

userSchema.pre('save', async function(next){          // since direct encryption is not possible using bcrypt therefore we use mongoose hooks like pre etc
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
  else{
    next();
  }
})

userSchema.methods.isPasswordCorrect = async function(password){         //Here we're comparing user password with encrypted password
 return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
    _id: this._id,
    email: this.email,
    username: this.userName,
    fullname: this.fullName
    },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
    _id: this._id,
    },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
}

export const User = mongoose.model("User",userSchema);



