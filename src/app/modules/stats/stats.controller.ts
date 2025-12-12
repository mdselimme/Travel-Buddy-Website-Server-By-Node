
import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import { IJwtTokenPayload } from '../../types/token.type';
import { StatsService } from './stats.service';

//Get Stats Controller
const getStats = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user as IJwtTokenPayload;

    const result = await StatsService.getStatsData(decodedToken);

    ApiResponse(res, {
        success: true,
        message: "Stats fetched successfully",
        data: result,
        statusCode: httpStatus.OK
    })
});



export const StatsController = {
    getStats
};