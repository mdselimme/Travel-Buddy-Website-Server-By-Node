import { model, Schema } from "mongoose";
import { ITravelPlan } from "./travelPlan.interface";



const travelPlanSchema = new Schema<ITravelPlan>({
    travelersIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    thumbnail: { type: String, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    activities: [{ type: String }],
    accommodations: { type: String },
    budgetRange: { type: Number, required: true },
    travelTypes: [{ type: String, required: true }],
    travelDescription: { type: String },
    reviewsIds: [{ type: Schema.Types.ObjectId, ref: "Review" }],
}, {
    versionKey: false,
    timestamps: true
});

export const TravelPlanModel = model<ITravelPlan>("TravelPlan", travelPlanSchema);