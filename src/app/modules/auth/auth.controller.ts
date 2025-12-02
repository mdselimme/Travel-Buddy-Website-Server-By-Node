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

//EMAIL VERIFICATION
const emailSendVerification = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await AuthService.emailSendVerification(email);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
        message: 'Email verification code sent successfully.',
    });
});

//EMAIL OTP VALIDATION
const verifyEmailOtpVerification = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await AuthService.verifyEmailOtpVerification(email, otp);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
        message: 'Email verified successfully.',
    });
});


//LOG OUT USER
const logOutUser = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'none'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'none'
    });


    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Logged Out Successfully.',
        data: null
    });
});

export const AuthController = {
    logInUser,
    changePassword,
    logOutUser,
    emailSendVerification,
    verifyEmailOtpVerification

}