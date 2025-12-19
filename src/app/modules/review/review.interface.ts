import { Types } from "mongoose";




export interface IReview {
    _id?: Types.ObjectId;
    arrangedBy: Types.ObjectId;
    arrangedByDescription: string;
    travelPlan: Types.ObjectId,
    traveler: Types.ObjectId,
    arrangedByRating: number;
    travelerRating: number;
    travelerDescription: string;
    createdAt?: Date;
    updatedAt?: Date;
};