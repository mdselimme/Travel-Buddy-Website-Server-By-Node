import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";
import { makeHashedPassword } from '../../utils/makeHashedPassword';



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

//Update User Role Service Function
const updateUserRoleService = async (userId: string, role: string): Promise<Partial<IUser> | null> => {

    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not found.');
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
    updateUserRoleService
}