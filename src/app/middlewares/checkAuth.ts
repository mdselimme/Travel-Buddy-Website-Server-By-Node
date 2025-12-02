import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { verifyToken } from '../utils/jwtToken';
import { envVars } from '../../config/envVariable.config';
import { IActiveStatus } from '../modules/users/user.interface';
import { IJwtTokenPayload } from '../types/token.type';
import { UserModel } from '../modules/users/user.model';



//User Role Check Auth
export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;

        if (!accessToken) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No token provided');
        };

        const verifiedToken = verifyToken(accessToken as string, envVars.JWT.ACCESS_TOKEN_SECRET) as IJwtTokenPayload;

        if (!verifiedToken) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
        };

        const isUserExist = await UserModel.findOne({ email: verifiedToken.email });

        if (!isUserExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
        }

        if (isUserExist.isVerified === false) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not verified');
        };

        if (isUserExist.isActive !== IActiveStatus.ACTIVE) {
            throw new ApiError(httpStatus.UNAUTHORIZED, `User account is ${isUserExist.isActive}`);
        };

        if (authRoles.length && !authRoles.includes(isUserExist.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to access this resource.');
        };

        req.user = verifiedToken;

        next();

    } catch (error) {
        next(error);
    }
};