/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}


export interface IPayment {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    subscription: Types.ObjectId;
    transactionId: string;
    invoiceUrl?: string;
    subscriptionType: string;
    subStartDate?: Date;
    subEndDate?: Date;
    paymentGatewayData?: any;
    status: PaymentStatus;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
};