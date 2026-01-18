/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IReview } from "./review.interface"
import { ReviewModel } from "./review.model";
import { TravelPlanModel } from '../travelPlan/travelPlan.model';
import { TravelPlanStatus } from '../travelPlan/travelPlan.interface';
import { createQuery } from '../../utils/querySearch';
import { ProfileModel } from '../profiles/profile.model';
import { Types } from 'mongoose';

const getAverageRating = async (reviewedId: Types.ObjectId, session?: any) => {

    const averageRatingAggregation = await ReviewModel.aggregate([
        {
            $match: {
                reviewed: new Types.ObjectId(reviewedId),
            },
        },
        {
            $group: {
                _id: "$reviewed",
                averageRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                averageRating: { $round: ["$averageRating", 1] },
            },
        },
    ]).session(session);

    const averageRating = averageRatingAggregation[0]?.averageRating || 0;
    return averageRating;
};

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

    const session = await ReviewModel.startSession();
    session.startTransaction();

    try {
        // Create the review
        const createdReview = await ReviewModel.create([reviewData], { session });
        // Recalculate average rating
        const averageRating = await getAverageRating(
            reviewData.reviewed as Types.ObjectId,
            session
        );
        // Update the profile with the new average rating
        await ProfileModel.findOneAndUpdate(
            { user: reviewData.reviewed },
            { averageRating },
            { new: true, runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return createdReview;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
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
const getMyReviews = async (reviewerId: string) => {
    const reviews = await ReviewModel.find({ reviewer: reviewerId })
        .populate("travelPlan", "travelTitle")
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
                    select: 'fullName profileImage',
                },
            },
            {
                path: 'reviewed',
                select: "profile",
                populate: {
                    path: 'profile',
                    select: 'fullName profileImage'
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
    const session = await ReviewModel.startSession();
    session.startTransaction();
    try {
        // Update the review
        const updatedReview = await ReviewModel.findByIdAndUpdate(
            id,
            reviewData,
            { new: true, runValidators: true, session }
        );
        // Recalculate average rating
        const averageRating = await getAverageRating(
            review.reviewed as Types.ObjectId,
            session
        );
        // Update the profile with the new average rating
        await ProfileModel.findOneAndUpdate(
            { user: review.reviewed },
            { averageRating },
            { runValidators: true, session }
        );
        await session.commitTransaction();
        session.endSession();
        return updatedReview;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//DELETE A REVIEW
const deleteReview = async (id: string) => {
    const review = await ReviewModel.findById(id);
    if (!review) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
    }
    const session = await ReviewModel.startSession();
    session.startTransaction();

    try {
        await ReviewModel.findByIdAndDelete(id, { session });

        const averageRating = await getAverageRating(
            review.reviewed as Types.ObjectId,
            session
        );

        await ProfileModel.findOneAndUpdate(
            { user: review.reviewed },
            { averageRating },
            { session }
        );

        await session.commitTransaction();
        session.endSession();
        return null;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//Travel Plan Reviews
const getTravelPlanReviews = async (travelPlanId: string, arrangerId: string) => {
    const reviews = await ReviewModel.find({
        travelPlan: travelPlanId,
        reviewed: arrangerId,
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



export const ReviewService = {
    createReview,
    getSingleReview,
    getAllReviews,
    updateReview,
    deleteReview,
    getMyReviews,
    getTravelPlanReviews
}