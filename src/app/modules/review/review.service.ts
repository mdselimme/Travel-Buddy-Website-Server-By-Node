/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IReview } from "./review.interface"
import { ReviewModel } from "./review.model";
import { TravelPlanModel } from '../travelPlan/travelPlan.model';
import { TravelPlanStatus } from '../travelPlan/travelPlan.interface';
import { createQuery } from '../../utils/querySearch';

//CREATE A REVIEW
const createReview = async (reviewData: Partial<IReview>) => {

    if (reviewData.reviewed === reviewData.reviewer) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You cannot review your own travel plan");
    }

    const travelPlan = await TravelPlanModel.findOne({
        _id: reviewData.travelPlan,
        travelPlanStatus: TravelPlanStatus.COMPLETED
    });

    if (!travelPlan) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can only review completed travel plans");
    }

    const travelUserExistingReview = await ReviewModel.findOne({
        reviewer: reviewData.reviewer,
        travelPlan: reviewData.travelPlan,
        reviewed: reviewData.reviewed,
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

//GET MY REVIEWS
const getMyReviews = async (travelerId: string) => {
    const reviews = await ReviewModel.find({
        $or: [
            { traveler: travelerId },
        ]
    }).populate("travelPlan", "travelTitle")
        .populate(
            {
                path: 'reviewer',
                select: "profile",
                populate: {
                    path: 'profile',
                    select: 'fullName'
                },
            }
        )
        .populate(
            {
                path: 'reviewed',
                select: "profile",
                populate: {
                    path: 'profile',
                    select: 'fullName'
                },
            }
        );
    return reviews;
};

//GET ALL REVIEWS
const getAllReviews = async (query: any) => {
    const { page, limit, sort } = query
    const reviews = await createQuery(ReviewModel)
        .paginate(page || 1, limit || 10)
        .populate("travelPlan", "travelTitle")
        .populateDeep([
            {
                path: 'reviewer',
                select: "profile",
                populate: {
                    path: 'profile',
                    select: 'fullName'
                },
            },
            {
                path: 'reviewed',
                select: "profile",
                populate: {
                    path: 'profile',
                    select: 'fullName'
                },
            }
        ])
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

//Travel Plan Reviews
const getTravelPlanReviews = async (travelPlanId: string, arrangerId: string) => {
    const reviews = await ReviewModel.find({
        travelPlan: travelPlanId,
        traveler: { $ne: arrangerId },
        user: arrangerId // Exclude reviews made by the requesting traveler
    }).populate("travelPlan", "travelTitle")
        .populate(
            {
                path: 'reviewed',
                select: "profile",
                populate: {
                    path: 'profile',
                    select: 'fullName'
                },
            }
        );
    return reviews;
};



export const ReviewService = {
    createReview,
    getSingleReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getMyReviews,
    getTravelPlanReviews
}