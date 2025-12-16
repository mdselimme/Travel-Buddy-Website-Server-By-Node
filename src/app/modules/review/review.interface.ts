import { Types } from "mongoose";




export interface IReview {
    _id?: Types.ObjectId;
    arrangedBy: Types.ObjectId;
    travelPlan: Types.ObjectId,
    traveler: Types.ObjectId,
    rating: number;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
};