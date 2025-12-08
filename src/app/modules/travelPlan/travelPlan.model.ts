import { model, Schema } from "mongoose";
import { ITravelPlan, TravelPlanStatus } from "./travelPlan.interface";






const travelPlanSchema = new Schema<ITravelPlan>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    travelTitle: { type: String, required: true, minlength: 3 },
    destination: {
        city: { type: String, required: true, minlength: 3 },
        country: { type: String, required: true, minlength: 3 }
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budgetRange: {
        min: { type: Number, required: true, min: 1 },
        max: { type: Number, required: true, min: 1 }
    },
    travelTypes: [{ type: Schema.Types.ObjectId, required: true, ref: "TravelType" }],
    travelDescription: { type: String },
    itinerary: [{ type: String, required: true }],
    thumbnail: { type: String, required: true },
    isVisible: { type: Boolean, required: true, default: true },
    travelPlanStatus: { type: String, enum: Object.values(TravelPlanStatus), default: TravelPlanStatus.UPCOMING }
}, {
    versionKey: false,
    timestamps: true
});

export const TravelPlanModel = model<ITravelPlan>("TravelPlan", travelPlanSchema);