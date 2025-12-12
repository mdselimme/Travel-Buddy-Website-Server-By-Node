import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import { SubscriptionService } from './subscription.service';





//CREATE CONTROLLER SUBSCRIPTION PLAN
const createSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {

    const result = await SubscriptionService.createSubscriptionService(req.body);

    ApiResponse(res, {
        success: true,
        message: "Subscription plan created successfully",
        statusCode: httpStatus.CREATED,
        data: result,
    });
});

//UPDATE CONTROLLER SUBSCRIPTION PLAN
const updateSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await SubscriptionService.updateSubscriptionService(id, updateData);
    ApiResponse(res, {
        success: true,
        message: "Subscription plan updated successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
});

//GET ALL CONTROLLER SUBSCRIPTION PLANS
const getAllSubscriptionPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getAllSubscriptionsService();
    ApiResponse(res, {
        success: true,
        message: "Subscription plans retrieved successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
});

//GET A CONTROLLER SUBSCRIPTION PLAN
const getSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubscriptionService.getSubscriptionService(id);
    ApiResponse(res, {
        success: true,
        message: "Subscription plan retrieved successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
});

//SOFT DELETE CONTROLLER SUBSCRIPTION PLAN
const softDeleteSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SubscriptionService.softDeleteSubscriptionService(id);
    ApiResponse(res, {
        success: true,
        message: "Subscription plan deleted successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
});


export const SubscriptionController = {
    createSubscriptionPlan,
    updateSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlan,
    softDeleteSubscriptionPlan
};