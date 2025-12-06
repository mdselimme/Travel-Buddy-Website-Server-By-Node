import { model, Schema } from "mongoose";
import { ITravelPlan, TravelPlanStatus } from "./travelPlan.interface";



const travelPlanSchema = new Schema<ITravelPlan>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    travelTitle: { type: String, required: true },
    destination: {
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budgetRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    travelTypes: [{ type: Schema.Types.ObjectId, required: true }],
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