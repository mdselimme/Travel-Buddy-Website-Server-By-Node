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

//GET PROFILE BY USER ID
const getProfileByUserId = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProfileService.getProfileByUserId(id);
    ApiResponse(res, {
        success: true,
        message: "Profile fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    })
});

//GET ALL PROFILES EXCEPT ADMIN AND SUPER ADMIN
const getAllProfiles = catchAsync(async (req: Request, res: Response) => {
    const result = await ProfileService.getAllProfilesExceptAdmins();
    ApiResponse(res, {
        success: true,
        message: "Profiles fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    })
});

export const ProfileController = {
    getProfileById,
    getProfileByUserId,
    getAllProfiles
}