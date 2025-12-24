import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ProfileModel } from "./profile.model";
import { UserModel } from "../users/user.model";
import { IActiveStatus, UserRole } from "../users/user.interface";




//GET ME PROFILE BY ID
const getProfileById = async (user: string) => {

    const profile = await ProfileModel.findOne({ user: user });

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
    }

    return profile;
}

//GET PROFILE BY USER ID
const getProfileByUserId = async (userId: string) => {
    const profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return profile;
};

//GET ALL PROFILES EXCEPT ADMIN AND SUPER ADMIN
const getAllProfilesExceptAdmins = async () => {
    // Find all users that are not admin or super_admin, and are active and verified
    const regularUsers = await UserModel.find({
        role: { $nin: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
        isActive: IActiveStatus.ACTIVE,
        isVerified: true,
        isProfileCompleted: true
    }).select('_id');

    const userIds = regularUsers.map(user => user._id);

    // Find profiles for these users
    const profiles = await ProfileModel.find({
        user: { $in: userIds }
    })
        .select('fullName profileImage currentLocation interests user')
        .populate('interests', 'typeName');

    return profiles;
};


export const ProfileService = {
    getProfileById,
    getProfileByUserId,
    getAllProfilesExceptAdmins
};