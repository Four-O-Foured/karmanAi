import {asyncHandler} from "../utils/asyncHandler.js";
import { loginUserService, registerUserService } from "../services/auth.service.js";
import { cookieOptions } from "../utils/helper.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { user, token } = await registerUserService(req.body);
    res.cookie("accessToken", token, cookieOptions);
   res.status(201).json({
     message: "User registered successfully",
     user,
   });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { user, token } = await loginUserService(req.body);
    res.cookie("accessToken", token, cookieOptions);
   res.status(201).json({
     message: "User logged in successfully",
     user
   });
});
