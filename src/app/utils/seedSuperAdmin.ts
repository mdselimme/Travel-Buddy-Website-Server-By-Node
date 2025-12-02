/* eslint-disable no-console */
import { envVars } from "../../config/envVariable.config";
import { IUser, UserRole } from "../modules/users/user.interface";
import { UserModel } from "../modules/users/user.model";
import { makeHashedPassword } from "./makeHashedPassword";


export const seedSuperAdmin = async () => {
    try {
        // Logic to seed super admin user using env variables
        const superAdminsData: Partial<IUser> = {
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
            const superAdmin = await UserModel.create(superAdminsData);
            if (superAdmin.email) {
                console.log("Super Admin user seeded successfully.");
            }
        } else {
            console.log("Super Admin user already exists. Skipping seeding.");
        };
    } catch (error) {
        console.log(error)
    }
}