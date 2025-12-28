import { Types } from "mongoose";




export interface IReview {
    _id?: Types.ObjectId;
    travelPlan: Types.ObjectId;
    reviewer: Types.ObjectId;
    reviewed: Types.ObjectId;
    description: string;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
};