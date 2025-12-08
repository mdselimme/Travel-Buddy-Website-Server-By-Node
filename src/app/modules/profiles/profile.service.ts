import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ProfileModel } from "./profile.model";




//GET ME PROFILE BY ID
const getProfileById = async (user: string) => {

    const profile = await ProfileModel.findOne({ user: user });


    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
    }

    return profile;
}

export const ProfileService = {
    getProfileById
};