/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
}


export interface IPayment {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    transactionId: string;
    invoiceUrl?: string;
    paymentGatewayData?: any;
    status: PaymentStatus;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
};