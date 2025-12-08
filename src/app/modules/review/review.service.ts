/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { IJwtTokenPayload } from "../../types/token.type"
import ApiError from "../../utils/ApiError";
import { IReview } from "./review.interface"
import { ReviewModel } from "./review.model";
import { TravelPlanModel } from '../travelPlan/travelPlan.model';
import { TravelPlanStatus } from '../travelPlan/travelPlan.interface';
import { createQuery } from '../../utils/querySearch';

//CREATE A REVIEW
const createReview = async (decodedToken: IJwtTokenPayload, reviewData: Partial<IReview>) => {

    reviewData.traveler = decodedToken.userId;

    const travelPlan = await TravelPlanModel.findOne({
        _id: reviewData.travelPlan, status: TravelPlanStatus.COMPLETED
    });

    if (!travelPlan) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can only review completed travel plans");
    }

    const travelUserExistingReview = await ReviewModel.findOne({
        travelPlan: reviewData.travelPlan,
        traveler: decodedToken.userId,
    });

    if (travelUserExistingReview) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You have already reviewed this travel plan");
    }

    const createdReview = await ReviewModel.create(reviewData);

    return createdReview;
};

//GET A SINGLE REVIEW
const getSingleReview = async (id: string) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
    };
    return review;
};

//GET ALL REVIEWS
const getAllReviews = async (query: any) => {
    const { page, limit, sort } = query
    const reviews = await createQuery(ReviewModel)
        .paginate(page || 1, limit || 10)
        .sort(sort || '-createdAt')
        .exec();

    return reviews;
};

// UPDATE A REVIEW
const updateReview = async (id: string, reviewData: Partial<IReview>) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
    }
    const updatedReview = await ReviewModel.findByIdAndUpdate(id, reviewData, { new: true });

    return updatedReview;
};

//DELETE A REVIEW
const deleteReview = async (id: string) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
    }
    await ReviewModel.findByIdAndDelete(id);
    return null;
};

export const ReviewService = {
    createReview,
    getSingleReview,
    getAllReviews,
    updateReview,
    deleteReview,
}