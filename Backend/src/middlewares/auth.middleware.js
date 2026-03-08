import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/helper.js";
import { findUserById } from "../DAO/user.dao.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        throw new ApiError(401, "Unauthorized");
    }
    const {id} = decodedToken;
    const user = await findUserById(id);
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    
    req.user = user;
    next();
});

export default authMiddleware;