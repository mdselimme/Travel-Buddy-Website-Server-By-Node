import { Types } from "mongoose";

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    USER = 'USER'
};

export enum IActiveStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
    DELETED = 'DELETED'
}


export interface IUser {
    _id?: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    contactNumber?: string;
    profileImage?: string;
    aboutMe?: string;
    address?: string;
    role: UserRole;
    visitedCountries?: string[];
    currentLocation?: string;
    travelInterests?: string[];
    travelsPlans?: Types.ObjectId[];
    isActive: IActiveStatus;
    createdAt?: Date;
    updatedAt?: Date;
}