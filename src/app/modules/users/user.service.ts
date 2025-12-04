/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";
import { makeHashedPassword } from '../../utils/makeHashedPassword';
import { createQuery } from '../../utils/querySearch';
import { IJwtTokenPayload } from '../../types/token.type';



//USER REGISTER SERVICE FUNCTION
const registerUserService = async (userData: Partial<IUser>): Promise<Partial<IUser> | null> => {
    // Check if user with the same email already exists
    const existingUser = await UserModel.findOne({ email: userData.email });

    // Check if user with the same email already exists
    if (existingUser) {
        throw new ApiError(httpStatus.CONFLICT, 'User email already exists.');
    };
    // Hash the password before saving
    const hashedPassword = await makeHashedPassword(userData.password as string);
    userData.password = hashedPassword;

    const newUserCreate = await UserModel.create(userData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUserCreate.toObject();

    return userWithoutPassword;
};

//Update User Data Service Function
const updateUserService = async (userId: string, updateData: Partial<IUser>): Promise<Partial<IUser> | null> => {

    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    );

    return updatedUser;

};

//GET ALL USERS SERVICE FUNCTION
const getAllUsersService = async (queryParams: any) => {

    const { limit,
        page, fields,
        role, email,
        isVerified, search,
        startDate, endDate } = queryParams;

    const users = await createQuery(UserModel)
        .filter({ role, email, isVerified })
        .search(['name', 'email'], search)
        .dateRange('createdAt', startDate, endDate)
        .paginate(page || 1, limit || 10)
        .select(fields || '-password')
        .exec();

    return users;
};

//GET USER PROFILE SERVICE FUNCTION
const getUserProfileService = async (decodedToken: IJwtTokenPayload): Promise<Partial<IUser> | null> => {
    const user = await UserModel.findById(decodedToken.userId).select('-password');
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
    const user = await UserModel.findById(userId).select('-password');
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



export const UserService = {
    registerUserService,
    updateUserService,
    updateUserRoleService,
    getAllUsersService,
    getUserByIdService,
    getUserProfileService
}