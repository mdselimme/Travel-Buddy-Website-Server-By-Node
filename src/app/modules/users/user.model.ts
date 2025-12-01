import { model, Schema } from "mongoose";
import { IActiveStatus, IUser, UserRole } from "./user.interface";


const userSchema = new Schema<IUser>({
    fullName: {
        type: String, required: [true, "Full name is required"], trim: true
    },
    email: {
        type: String, required: [true, "Email is required"], unique: true, trim: true
    },
    password: {
        type: String, required: [true, "Password is required"], trim: true
    },
    contactNumber: {
        type: String, trim: true
    },
    profileImage: {
        type: String, trim: true
    },
    aboutMe: {
        type: String, trim: true
    },
    address: {
        type: String, trim: true
    },
    role: {
        type: String, enum: Object.values(UserRole), default: UserRole.USER
    },
    visitedCountries: {
        type: [String], default: []
    },
    currentLocation: {
        type: String, trim: true
    },
    travelInterests: {
        type: [String], default: []
    },
    travelsPlans: {
        type: [Schema.Types.ObjectId], ref: 'TravelPlan', default: []
    },
    isActive: {
        type: String, enum: Object.values(IActiveStatus), default: IActiveStatus.ACTIVE
    },
    isVerified: {
        type: Boolean, default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

export const UserModel = model<IUser>('User', userSchema);