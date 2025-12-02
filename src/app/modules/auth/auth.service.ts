import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError"
import { IUser } from "../users/user.interface"
import { UserModel } from "../users/user.model"
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtToken';
import { envVars } from '../../../config/envVariable.config';




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




export const AuthService = {
    logInUser,
    changePassword
}