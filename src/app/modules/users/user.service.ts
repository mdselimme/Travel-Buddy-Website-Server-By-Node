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
        throw new ApiError(httpStatus.CONFLICT, 'User with this email already exists');
    };
    // Hash the password before saving
    const hashedPassword = await makeHashedPassword(userData.password as string);
    userData.password = hashedPassword;

    const newUserCreate = await UserModel.create(userData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUserCreate.toObject();

    return userWithoutPassword;
};

export const UserService = {
    registerUserService,
}