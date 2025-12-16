import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchemaModel = new Schema<IReview>({
    travelPlan: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    arrangedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});

export const ReviewModel = model<IReview>('Review', reviewSchemaModel);