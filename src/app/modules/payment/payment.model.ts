import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";



const paymentSchemaModel = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    subscription: { type: Schema.Types.ObjectId, required: true, ref: "Subscription" },
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