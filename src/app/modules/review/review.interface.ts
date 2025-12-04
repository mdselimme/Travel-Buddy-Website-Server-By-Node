import { Types } from "mongoose";




export interface IReview {
    _id?: Types.ObjectId;
    travelPlanId: Types.ObjectId,
    travelerId: Types.ObjectId,
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
};