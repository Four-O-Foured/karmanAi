import { findUserByEmail } from "../DAO/user.dao.js";
import userModel from "../model/user.model.js";
import { generateToken } from "../utils/helper.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUserService = async (body) => {

    const { username, email, password } = body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await findUserByEmail(email);

    if (user) {
        throw new ApiError(400, "User already exists");
    }

    const newUser = await userModel.create({
        username,
        email,
        password,
    });

    const token = generateToken(newUser._id);

    return { user: newUser, token };
}

export const loginUserService = async (body) => {
    const { email, password } = body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new ApiError(400, "User not found");
    }
    
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials");
    }

    const token = generateToken(user._id);

    return { user, token };
}