import httpStatus from 'http-status-codes';
import ApiResponse from "../../utils/ApiResponse";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { Request, Response } from 'express';

//REGISTER USER CONTROLLER
const registerUser = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;
    const newUser = await UserService.registerUserService(userData);

    ApiResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully',
        data: newUser
    });
});
//UPDATE USER CONTROLLER
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { userId, ...updateData } = req.body;
    const updatedUser = await UserService.updateUserService(userId, updateData);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: updatedUser
    });
});

// UPDATE USER ROLE CONTROLLER 
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const { userId, role } = req.body;
    const updatedUser = await UserService.updateUserRoleService(userId, role);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: updatedUser
    });
});

export const UserController = {
    registerUser,
    updateUser,
    updateUserRole
}