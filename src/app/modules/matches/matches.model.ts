import { model, Schema } from "mongoose";
import { IMatch, MatchStatus } from "./matches.interface";

const matchesModelSchema = new Schema<IMatch>({
    travelPlanId: { type: String, required: true, ref: 'TravelPlan' },
    senderId: { type: String, required: true, ref: 'User' },
    receiverId: { type: String, required: true, ref: 'User' },
    status: { type: String, required: true, enum: Object.values(MatchStatus), default: MatchStatus.REQUESTED },
}, {
    timestamps: true,
    versionKey: false,
});

export const MatchesModel = model<IMatch>("Match", matchesModelSchema);