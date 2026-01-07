import httpStatus from 'http-status-codes';
import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import ApiResponse from "../../utils/ApiResponse"
import { TravelPlanService } from './travelPlan.service';
import ApiError from '../../utils/ApiError';
import { IJwtTokenPayload } from '../../types/token.type';




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
const getAllTravelPlansForUsers = catchAsync(async (req: Request, res: Response) => {

    const result = await TravelPlanService.getAllTravelPlansForUsers(req.query);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel Plans retrieved successfully",
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

// GET MY TRAVEL PLANS CONTROLLER
const getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as IJwtTokenPayload;
    const userId = decodedToken?.userId;
    const result = await TravelPlanService.getMyTravelPlans(userId);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Travel Plans retrieved successfully",
        data: result
    });
});

// GET MY MATCHES TRAVEL PLANS CONTROLLER
const getMyMatchesTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as IJwtTokenPayload;
    const userId = decodedToken?.userId;
    const result = await TravelPlanService.getMyMatchesTravelPlans(userId);
    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Matches Travel Plans retrieved successfully",
        data: result
    });
});

//GET TRAVEL PLANS CITIES CONTROLLER
const getTravelPlansCities = catchAsync(async (req: Request, res: Response) => {
    const result = await TravelPlanService.getTravelPlansCities();
    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel Plans cities retrieved successfully",
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
    getAllTravelPlansForUsers,
    getSingleTravelPlan,
    getMyTravelPlans,
    deleteATravelPlan,
    getMyMatchesTravelPlans,
    getTravelPlansCities,
    getAllTravelPlans
}