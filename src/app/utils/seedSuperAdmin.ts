/* eslint-disable no-console */
import { envVars } from "../../config/envVariable.config";
import { ProfileModel } from "../modules/profiles/profile.model";
import { IUser, UserRole } from "../modules/users/user.interface";
import { UserModel } from "../modules/users/user.model";
import { makeHashedPassword } from "./makeHashedPassword";


export const seedSuperAdmin = async () => {
    const session = await UserModel.startSession();
    session.startTransaction();
    try {
        // Logic to seed super admin user using env variables
        const superAdminsData: Partial<IUser & { fullName: string }> = {
            email: envVars.SUPER_ADMIN_EMAIL,
            password: envVars.SUPER_ADMIN_PASSWORD,
            fullName: envVars.SUPER_ADMIN_NAME,
        };

        // Add logic to save superAdmin to the database
        const superAdminExists = await UserModel.findOne({ email: superAdminsData.email });

        if (!superAdminExists) {
            const hashedPass = await makeHashedPassword(superAdminsData.password as string);
            superAdminsData.password = hashedPass;
            superAdminsData.role = UserRole.SUPER_ADMIN;
            superAdminsData.isVerified = true;
            // Save superAdmin to the database
            const superAdmin = await UserModel.create([superAdminsData], { session });

            const createdProfileData = {
                user: superAdmin[0]._id,
                fullName: superAdminsData.fullName as string,
                email: superAdmin[0].email,
            };

            const createdProfile = await ProfileModel.create([createdProfileData], { session });

            // Link the created profile to the user
            superAdmin[0].profile = createdProfile[0]._id;
            superAdmin[0].isProfileCompleted = false;
            await superAdmin[0].save({ session });
            await session.commitTransaction();
            session.endSession();

            if (superAdmin[0].email) {
                console.log("Super Admin user seeded successfully.");
            }
        } else {
            await session.commitTransaction();
            session.endSession();
            console.log("Super Admin user already exists. Skipping seeding.");
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
    }
}