import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError"
import { IActiveStatus, IUser } from "../users/user.interface"
import { UserModel } from "../users/user.model"
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtToken';
import { envVars } from '../../../config/envVariable.config';
import { sendEmail } from '../../utils/sendEmail';
import { generateOtpCode, OTP_EXPIRATION } from '../../utils/otpGenerate';
import { redisClient } from '../../../config/redis.config';




//AUTH LOGIN SERVICE 
const logInUser = async (payload: Partial<IUser>) => {

    const existingUser = await UserModel.findOne({ email: payload.email });

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found')
    };

    const isPasswordMatch = await bcrypt.compare(payload.password as string, existingUser.password);

    if (!isPasswordMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
    };

    const jwtUserPayload = {
        userId: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
        fullName: existingUser.fullName
    };

    const accessToken = generateToken(jwtUserPayload, envVars.JWT.ACCESS_TOKEN_SECRET, envVars.JWT.ACCESS_TOKEN_EXPIRED);

    const refreshToken = generateToken(jwtUserPayload, envVars.JWT.REFRESH_TOKEN_SECRET, envVars.JWT.REFRESH_TOKEN_EXPIRED);

    return {
        ...jwtUserPayload,
        isVerified: existingUser.isVerified,
        accessToken,
        refreshToken
    };
};

//CHANGE PASSWORD SERVICE 
const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {

    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, existingUser.password);

    if (!isPasswordMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
    };

    const hashedPassword = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUNDS));

    await UserModel.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true, runValidators: true }
    );

    return {
        message: 'Password changed successfully'
    }
};

//EMAIL SEND VERIFICATION OTP SERVICE
const emailSendVerification = async (email: string) => {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
    }

    const otp = generateOtpCode();

    const redisKey = `otp:${email}`;

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });

    sendEmail({
        to: existingUser.email,
        subject: 'Email Verification',
        templateName: 'emailVerification',
        templateData: {
            name: existingUser.fullName,
            otp: otp,
            subject: 'Email Verification From Travel Buddy.',
        }
    });
}

//Verify Email Validation Service
const verifyEmailOtpVerification = async (email: string, otp: string) => {

    const isUserExist = await UserModel.findOne({ email });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
    };

    if (isUserExist.isVerified) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already verified');
    }

    if (isUserExist.isActive !== IActiveStatus.ACTIVE) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not active');
    }

    const redisKey = `otp:${email}`;

    const savedOtp = await redisClient.get(redisKey);

    if (!savedOtp) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp Value.');
    };

    if (savedOtp !== otp) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp Value.');
    }

    await Promise.all([
        UserModel.findByIdAndUpdate(
            isUserExist._id,
            { isVerified: true },
            { new: true, runValidators: true }
        ),
        redisClient.del(redisKey)
    ]);

    return {
        message: 'Email verified successfully'
    }

};




export const AuthService = {
    logInUser,
    changePassword,
    emailSendVerification,
    verifyEmailOtpVerification

}