import { model, Schema } from "mongoose";
import { IProfile } from "./profile.interface";


const profileSchemaModel = new Schema<IProfile>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true },
    contactNumber: { type: String },
    profileImage: { type: String },
    address: { type: String },
    bio: { type: String },
    visitedPlaces: [{ type: String, default: [] }],
    isSubscribed: { type: Boolean, default: false },
    subStartDate: { type: Date },
    subEndDate: { type: Date },
    currentLocation: { type: String },
    interests: [{ type: String, default: [] }],
}, {
    timestamps: true,
    versionKey: false
});

export const ProfileModel = model<IProfile>('Profile', profileSchemaModel);