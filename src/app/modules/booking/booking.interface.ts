import { Types } from "mongoose";

export enum BookingStatus {
    ONGOING = "ONGOING",
    BOOKED = "BOOKED",
    CANCELLED = "CANCELLED"
};


export interface IBooking {
    _id?: Types.ObjectId;
    travelerId: Types.ObjectId;
    paymentId: Types.ObjectId;
    travelPlanId: Types.ObjectId;
    totalMembers: number;
    status: BookingStatus;
    totalCosts: number;
    createdAt?: Date;
    updatedAt?: Date;
}