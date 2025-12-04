import httpStatus from 'http-status-codes';
import ApiResponse from "../../utils/ApiResponse";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { Request, Response } from 'express';
import { IJwtTokenPayload } from '../../types/token.type';

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
    updateData.profileImage = req.file?.path;
    const updatedUser = await UserService.updateUserService(userId, updateData);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: updatedUser
    });
});

//GET ALL USERS CONTROLLER
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const queryParams = req.query || {};
    const users = await UserService.getAllUsersService(queryParams);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: users
    });
});

//GET USER PROFILE CONTROLLER
const getUserProfile = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const user = await UserService.getUserProfileService(decodedToken as IJwtTokenPayload);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: user
    });

});

//GET USER BY ID CONTROLLER
const getUserById = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const userId = req.params.id;
    const user = await UserService.getUserByIdService(userId, decodedToken as IJwtTokenPayload);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user
    });
});

//UPDATE USER STATUS CONTROLLER
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { isActive } = req.body;
    const decodedToken = req.user;

    const updatedUser = await UserService.updateUserStatusService(userId, isActive, decodedToken as IJwtTokenPayload);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
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
    updateUserRole,
    getAllUsers,
    getUserById,
    getUserProfile,
    updateUserStatus
}