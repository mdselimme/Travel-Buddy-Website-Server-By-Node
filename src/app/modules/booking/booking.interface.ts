import { Types } from "mongoose";

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}


export interface IBooking {
    _id?: string;
    travelersId: Types.ObjectId[];
    paymentsId: Types.ObjectId[];
    travelPlanId: Types.ObjectId;
    total: number;
    status: BookingStatus;
    createdAt?: Date;
    updatedAt?: Date;
}