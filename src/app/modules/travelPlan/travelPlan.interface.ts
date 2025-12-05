import { Types } from "mongoose";


export enum TravelPlanStatus {
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}


export interface ITravelPlan {
    _id?: Types.ObjectId;
    travelTitle: string;
    travelersIds?: Types.ObjectId[];
    thumbnail: string;
    bookingId?: Types.ObjectId;
    creatorId: Types.ObjectId;
    destination: string;
    startDate: Date;
    endDate: Date;
    travelPlanStatus: TravelPlanStatus;
    activities?: string[];
    accommodations?: string;
    budgetRange: number;
    travelTypes: string[];
    travelDescription?: string;
    reviewsIds?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
};