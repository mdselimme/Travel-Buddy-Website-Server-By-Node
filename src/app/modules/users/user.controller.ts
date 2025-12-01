import httpStatus from 'http-status-codes';
import ApiResponse from "../../utils/ApiResponse";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";

//REGISTER USER CONTROLLER
const registerUser = catchAsync(async (req, res) => {
    const userData = req.body;
    const newUser = await UserService.registerUserService(userData);

    ApiResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully',
        data: newUser
    });
});

export const UserController = {
    registerUser,
}