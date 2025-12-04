import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import ApiResponse from "../../utils/ApiResponse"
import { TravelPlanService } from './travelPlan.service';
import ApiError from '../../utils/ApiError';




//CREATE A NEW TRAVEL PLAN CONTROLLER
const createATravelPlan = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;

    if (!req.file?.path) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Thumbnail image is required");
    }

    payload.thumbnail = req.file?.path;

    const result = await TravelPlanService.createATravelPlan(payload);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Travel Plan created successfully",
        data: result
    })

});

//UPDATE A TRAVEL PLAN CONTROLLER
const updateATravelPlan = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const payload = req.body;
    if (req.file?.path) {
        payload.thumbnail = req.file.path;
    }

    const result = await TravelPlanService.updateATravelPlan(id, payload);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel Plan updated successfully",
        data: result
    });

});

//GET ALL TRAVEL PLANS CONTROLLER
const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {

    const result = await TravelPlanService.getAllTravelPlans(req.query);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel Plans retrieved successfully",
        data: result
    });
});

//GET SINGLE TRAVEL PLAN CONTROLLER
const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TravelPlanService.getSingleTravelPlan(id);
    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel Plan retrieved successfully",
        data: result
    });
});

//DELETE A TRAVEL PLAN CONTROLLER
const deleteATravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await TravelPlanService.deleteATravelPlan(id);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel Plan deleted successfully",
        data: result
    });
});

export const TravelPlanController = {
    createATravelPlan,
    updateATravelPlan,
    getAllTravelPlans,
    getSingleTravelPlan,
    deleteATravelPlan
}