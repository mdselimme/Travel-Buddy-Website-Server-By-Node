import { model, Schema } from "mongoose";
import { ISubscription, SubscriptionPlan } from "./subscription.interface";



const subscriptionSchemaModel = new Schema<ISubscription>({
    plan: {
        type: String,
        enum: Object.values(SubscriptionPlan),
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: false,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

export const SubscriptionModel = model<ISubscription>('Subscription', subscriptionSchemaModel);