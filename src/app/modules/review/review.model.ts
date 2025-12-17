import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchemaModel = new Schema<IReview>({
    travelPlan: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    arrangedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    arrangedByRating: { type: Number, required: true },
    arrangedByDescription: { type: String, required: true },
    travelerRating: { type: Number, default: 0 },
    travelerByDescription: { type: String, default: "" },
}, {
    timestamps: true,
    versionKey: false,
});

export const ReviewModel = model<IReview>('Review', reviewSchemaModel);