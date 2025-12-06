import { model, Schema } from "mongoose";
import { ITravelType } from "./travelType.interface";


const travelTypeModel = new Schema<ITravelType>({
    typeName: { type: String, required: true, unique: true }
}, {
    versionKey: false,
    timestamps: true
});

export const TravelTypeModel = model<ITravelType>("TravelType", travelTypeModel);