import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import { ReviewService } from './review.service';
import { IJwtTokenPayload } from '../../types/token.type';


//CREATE A REVIEW
const createReview = catchAsync(async (req: Request, res: Response) => {

    const result = await ReviewService.createReview(req.body);

    ApiResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});

//GET MY REVIEWS
const getMyReviews = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const travelerId = (decodedToken as IJwtTokenPayload).userId;
    const result = await ReviewService.getMyReviews(travelerId);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My reviews fetched successfully",
        data: result,
    });
});

//GET A SINGLE REVIEW
const getSingleReview = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;

    const result = await ReviewService.getSingleReview(id);

    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review fetched successfully",
        data: result,
    });
});

//GET ALL REVIEWS
const getAllReviews = catchAsync(async (req: Request, res: Response) => {

    const result = await ReviewService.getAllReviews(req.query);

    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reviews fetched successfully",
        data: result,
    });
});

//UPDATE A REVIEW
const updateReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await ReviewService.updateReview(id, req.body);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});

//Travel Plan Reviews
const getTravelPlanReviews = catchAsync(async (req: Request, res: Response) => {
    const travelPlanId = req.params.id;
    const decodedToken = req.user;
    const travelerId = (decodedToken as IJwtTokenPayload).userId;
    const result = await ReviewService.getTravelPlanReviews(travelPlanId, travelerId);
    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Travel plan reviews fetched successfully",
        data: result,
    });
});

//DELETE A REVIEW
const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ReviewService.deleteReview(id);

    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
});


export const ReviewController = {
    createReview,
    getSingleReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getMyReviews,
    getTravelPlanReviews
};