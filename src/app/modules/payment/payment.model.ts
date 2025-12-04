import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";



const paymentSchemaModel = new Schema<IPayment>({
    travelerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    travelPlanId: { type: Schema.Types.ObjectId, required: true, ref: "TravelPlan" },
    bookingId: { type: Schema.Types.ObjectId, required: true, ref: "Booking" },
    transactionId: { type: String, required: true, unique: true },
    invoiceUrl: { type: String },
    paymentGatewayData: { type: Schema.Types.Mixed },
    status: { type: String, required: true, enum: Object.values(PaymentStatus) },
    amount: { type: Number, required: true },
}, {
    versionKey: false,
    timestamps: true,
});

export const PaymentModel = model<IPayment>("Payment", paymentSchemaModel);