import { Types } from "mongoose";




export interface IReview {
    _id?: Types.ObjectId;
    travelPlan: Types.ObjectId;
    user: Types.ObjectId;
    traveler: Types.ObjectId,
    description: string;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
};