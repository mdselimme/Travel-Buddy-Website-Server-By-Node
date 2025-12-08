import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { ProfileService } from "./profile.service"
import ApiResponse from "../../utils/ApiResponse";
import { IJwtTokenPayload } from "../../types/token.type";



//GET PROFILE BY ID
const getProfileById = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user as IJwtTokenPayload

    const result = await ProfileService.getProfileById(decodedToken.userId);

    ApiResponse(res, {
        success: true,
        message: "Profile fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    })

});

export const ProfileController = {
    getProfileById
}