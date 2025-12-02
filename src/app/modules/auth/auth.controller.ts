import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import { AuthService } from './auth.service';
import { setTokenAuthCookie } from '../../utils/setTokenCookie';



//Auth Login Controller
const logInUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.logInUser(req.body);

    //Set Token In cookie
    setTokenAuthCookie(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
    });

    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Logged In Successfully.',
        data: result
    });
});

// CHANGE PASSWORD CONTROLLER 
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const decodedToken = req.user;

    const result = await AuthService.changePassword(decodedToken.userId, oldPassword, newPassword);


    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
        message: 'Password changed successfully',
    });
});

export const AuthController = {
    logInUser,
    changePassword

}