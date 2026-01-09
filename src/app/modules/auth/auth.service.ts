import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError"
import { IActiveStatus, IUser } from "../users/user.interface"
import { UserModel } from "../users/user.model"
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../../utils/jwtToken';
import { envVars } from '../../../config/envVariable.config';
import { sendEmail } from '../../utils/sendEmail';
import { generateOtpCode, OTP_EXPIRATION } from '../../utils/otpGenerate';
import { redisClient } from '../../../config/redis.config';
import { IJwtTokenPayload } from '../../types/token.type';
import { ProfileModel } from '../profiles/profile.model';




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

    if (!existingUser.isVerified) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not verified. Please verify your email.');
    }

    if (existingUser.isActive !== IActiveStatus.ACTIVE) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not active. Please contact support.');
    }

    const profile = await ProfileModel.findById(existingUser.profile);

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User profile does not found')
    }

    const jwtUserPayload = {
        fullName: profile?.fullName,
        userId: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
    };

    const accessToken = generateToken(jwtUserPayload, envVars.JWT.ACCESS_TOKEN_SECRET, envVars.JWT.ACCESS_TOKEN_EXPIRED);

    const refreshToken = generateToken(jwtUserPayload, envVars.JWT.REFRESH_TOKEN_SECRET, envVars.JWT.REFRESH_TOKEN_EXPIRED);

    return {
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        isActive: existingUser.isActive,
        isProfileCompleted: existingUser.isProfileCompleted,
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

    const profile = await ProfileModel.findById(existingUser.profile);

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User profile does not found')
    }


    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });

    await sendEmail({
        to: existingUser.email,
        subject: 'Email Verification',
        templateName: 'emailVerification',
        templateData: {
            name: profile?.fullName,
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

//FORGOT PASSWORD EMAIL
const forgotPassword = async (email: string) => {

    const isUserExist = await UserModel.findOne({ email });

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
    }

    if (!isUserExist.isVerified) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not verified');
    }

    if (isUserExist.isActive !== IActiveStatus.ACTIVE) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not active');
    }

    const profile = await ProfileModel.findById(isUserExist.profile);

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User profile does not found')
    }


    const jwtUserPayload = {
        userId: isUserExist._id,
        role: isUserExist.role,
        email: isUserExist.email,
        fullName: profile?.fullName
    };

    const tokenForForgotPass = generateToken(jwtUserPayload, envVars.JWT.ACCESS_TOKEN_SECRET, envVars.JWT.FORGOT_TOKEN_EXPIRED);

    const redirectUrl = `${envVars.CLIENT_SITE_URL}/reset-password?token=${tokenForForgotPass}&userId=${isUserExist._id}`;

    await sendEmail({
        to: isUserExist.email,
        subject: 'Forgot Password Email',
        templateName: 'forgotPassword',
        templateData: {
            name: profile?.fullName,
            redirectUrl: redirectUrl,
            subject: 'Forgot Password Email from Travel Buddy.',
        }
    });

    return {
        message: 'Forgot Password Email Send Successfully.'
    }
};

//FORGOT PASSWORD RESET
const forgotPasswordReset = async (token: string, password: string) => {
    const decodedToken = verifyToken(token, envVars.JWT.ACCESS_TOKEN_SECRET) as IJwtTokenPayload;

    const isUserExist = await UserModel.findById(decodedToken.userId);

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
    };

    const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUNDS));

    await UserModel.findByIdAndUpdate(
        decodedToken.userId,
        { password: hashedPassword },
        { new: true, runValidators: true }
    );

    return {
        message: 'Password Reset Successfully.'
    }
};

//REFRESH TOKEN UNDO SERVICE
const undoRefreshToken = async (token: string) => {
    const decodedToken = verifyToken(token, envVars.JWT.REFRESH_TOKEN_SECRET) as IJwtTokenPayload;

    const isUserExists = await UserModel.findById(decodedToken.userId);

    if (!isUserExists) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
    };

    if (!isUserExists.isVerified) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not verified');
    }

    if (isUserExists.isActive !== IActiveStatus.ACTIVE) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not active');
    }

    const profile = await ProfileModel.findById(isUserExists.profile);

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User profile does not found')
    }


    const jwtUserPayload = {
        userId: isUserExists._id,
        role: isUserExists.role,
        email: isUserExists.email,
        fullName: profile?.fullName
    };

    const accessToken = generateToken(jwtUserPayload, envVars.JWT.ACCESS_TOKEN_SECRET, envVars.JWT.ACCESS_TOKEN_EXPIRED);

    const refreshToken = generateToken(jwtUserPayload, envVars.JWT.REFRESH_TOKEN_SECRET, envVars.JWT.REFRESH_TOKEN_EXPIRED);

    return {
        accessToken,
        refreshToken
    };
};

export const AuthService = {
    logInUser,
    changePassword,
    emailSendVerification,
    verifyEmailOtpVerification,
    forgotPassword,
    forgotPasswordReset,
    undoRefreshToken
}