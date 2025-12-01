


//User Register Service
const registerUserService = async (userData: IUser): Promise<IUser | null> => {
    const user = await UserModel.create(userData);
    return user;
}