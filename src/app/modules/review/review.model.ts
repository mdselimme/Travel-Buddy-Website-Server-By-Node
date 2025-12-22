import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchemaModel = new Schema<IReview>({
    travelPlan: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, {
    timestamps: true,
    versionKey: false,
});

export const ReviewModel = model<IReview>('Review', reviewSchemaModel);