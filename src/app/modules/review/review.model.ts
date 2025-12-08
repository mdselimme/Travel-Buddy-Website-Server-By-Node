import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";


const reviewSchemaModel = new Schema<IReview>({
    travelPlan: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});

export const ReviewModel = model<IReview>('Review', reviewSchemaModel);