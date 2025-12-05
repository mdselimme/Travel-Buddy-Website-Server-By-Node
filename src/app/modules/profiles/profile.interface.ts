import { Types } from "mongoose";


export interface IProfile {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    fullName: string;
    email: string;
    contactNumber?: string;
    profileImage?: string;
    address?: string;
    bio?: string;
    visitedPlaces?: string[];
    isSubscribed: boolean;
    subStartDate?: Date;
    subEndDate?: Date;
    currentLocation?: string;
    interests?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}