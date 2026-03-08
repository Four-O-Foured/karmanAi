import userModel from "../model/user.model.js";

export const findUserByEmail = async (email) => {
    const user = await userModel.findOne({ email });
    return user;
};

export const findUserById = async (id) => {
    const user = await userModel.findById(id);
    return user;
};

