import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import ApiResponse from "../../utils/ApiResponse"
import { TravelPlanService } from './travelPlan.service';




//CREATE A NEW TRAVEL PLAN CONTROLLER
const createATravelPlan = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;
    payload.thumbnail = req.file?.path;

    const result = await TravelPlanService.createATravelPlan(payload);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Travel Plan created successfully",
        data: result
    })

})

export const TravelPlanController = {
    createATravelPlan
}