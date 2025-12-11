/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IUser, UserRole } from "./user.interface";
import { UserModel } from "./user.model";
import { makeHashedPassword } from '../../utils/makeHashedPassword';
import { createQuery } from '../../utils/querySearch';
import { IJwtTokenPayload } from '../../types/token.type';
import { ProfileModel } from '../profiles/profile.model';
import { deleteImageFromCloudinary } from '../../../config/cloudinary.config';



//USER REGISTER SERVICE FUNCTION
const registerUserService = async (userData: Partial<IUser & { fullName: string }>): Promise<Partial<IUser> | null> => {

    const session = await UserModel.startSession();
    session.startTransaction();

    try {
        // Check if user with the same email already exists
        const existingUser = await UserModel.findOne({ email: userData.email });

        // Check if user with the same email already exists
        if (existingUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User email already exists.');
        };
        // Hash the password before saving
        const hashedPassword = await makeHashedPassword(userData.password as string);
        userData.password = hashedPassword;

        const newUserCreate = await UserModel.create([userData], { session });

        const createProfileData = {
            fullName: userData.fullName as string,
            user: newUserCreate[0]._id,
            email: newUserCreate[0].email,
        };

        const createdProfile = await ProfileModel.create([createProfileData], { session });

        // Link the created profile to the user
        newUserCreate[0].profile = createdProfile[0]._id;
        newUserCreate[0].isProfileCompleted = false;
        await newUserCreate[0].save({ session });


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = newUserCreate[0].toObject();
        await session.commitTransaction();
        session.endSession();

        return userWithoutPassword;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//Update User Data Service Function
const updateUserService = async (userId: string, updateData: Partial<IUser>): Promise<Partial<IUser> | null> => {

    const session = await UserModel.startSession();
    session.startTransaction();

    try {

        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
        };

        const updatedUser = await ProfileModel.findByIdAndUpdate(
            existingUser.profile,
            updateData,
            { new: true, runValidators: true, session }
        );

        if (updatedUser) {
            existingUser.isProfileCompleted = true;
            await existingUser.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return updatedUser;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

//GET ALL USERS SERVICE FUNCTION
const getAllUsersService = async (queryParams: any) => {

    const { limit,
        page, fields,
        role, email, sort,
        isVerified, search,
        startDate, endDate } = queryParams;

    const users = await createQuery(UserModel)
        .filter({ role, email, isVerified })
        .search(['fullName', 'email'], search)
        .sort(sort || '-createdAt')
        .dateRange('createdAt', startDate, endDate)
        .populate('profile')
        .paginate(page || 1, limit || 10)
        .select(fields || '-password')
        .exec();

    return users;
};

//GET USER PROFILE SERVICE FUNCTION
const getUserProfileService = async (decodedToken: IJwtTokenPayload): Promise<Partial<IUser> | null> => {
    const user = await UserModel.findById(decodedToken.userId)
        .select('-password');

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
    };

    return user;
};

//GET USER BY ID SERVICE FUNCTION
const getUserByIdService = async (userId: string, decodedToken: IJwtTokenPayload): Promise<Partial<IUser> | null> => {
    if (decodedToken.role === 'USER' && decodedToken.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to access this user data.');
    }
    const user = await UserModel.findById(userId).select('-password').populate('profile');
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
    };
    return user;
};

//Update User Role Service Function
const updateUserRoleService = async (userId: string, role: string): Promise<Partial<IUser> | null> => {

    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
    };

    if (existingUser.role === role.toUpperCase()) {
        throw new ApiError(httpStatus.BAD_REQUEST, `User is already assigned the role of ${role}.`);
    };


    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    );
    return {
        role: updatedUser?.role
    };
};

//UPDATE USER STATUS SERVICE FUNCTION
const updateUserStatusService = async (userId: string, isActive: string, decodedToken: IJwtTokenPayload): Promise<Partial<IUser> | null> => {
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
    };

    if (decodedToken.role !== UserRole.SUPER_ADMIN && existingUser.role === UserRole.SUPER_ADMIN) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update user status.');
    };

    if (existingUser.isActive === isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, `User status is already ${isActive}.`);
    };
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true, runValidators: true }
    );
    return {
        isActive: updatedUser?.isActive
    };
};

//DELETE AN USER SERVICE FUNCTION
const deleteAnUserService = async (userId: string) => {
    const session = await UserModel.startSession();
    session.startTransaction();
    try {
        const isUserExist = await UserModel.findById(userId);

        if (!isUserExist) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
        };

        await UserModel.findByIdAndDelete(userId, { session });
        //Profile Delete and Image from Cloudinary
        const profile = await ProfileModel.findByIdAndDelete(isUserExist.profile, { session });
        await deleteImageFromCloudinary(profile?.profileImage as string);
        await session.commitTransaction();
        session.endSession();
        return {
            message: `User with id ${userId} has been deleted successfully.`,
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };
};



export const UserService = {
    registerUserService,
    updateUserService,
    updateUserRoleService,
    getAllUsersService,
    getUserByIdService,
    getUserProfileService,
    updateUserStatusService,
    deleteAnUserService
}