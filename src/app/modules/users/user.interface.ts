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
    email: string;
    password: string;
    isProfileCompleted: boolean;
    role: UserRole;
    isActive: IActiveStatus;
    profile?: Types.ObjectId;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}