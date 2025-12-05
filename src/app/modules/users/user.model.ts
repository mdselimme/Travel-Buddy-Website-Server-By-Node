import { model, Schema } from "mongoose";
import { IActiveStatus, IUser, UserRole } from "./user.interface";


const userSchema = new Schema<IUser>({
    email: {
        type: String, required: [true, "Email is required"], unique: true, trim: true
    },
    password: {
        type: String, required: [true, "Password is required"], trim: true
    },
    isProfileCompleted: {
        type: Boolean, default: false
    },
    role: {
        type: String, enum: Object.values(UserRole), default: UserRole.USER
    },
    profile: {
        type: Schema.Types.ObjectId, ref: 'Profile'
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