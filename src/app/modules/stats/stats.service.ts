import { IJwtTokenPayload } from "../../types/token.type";
import { ProfileModel } from "../profiles/profile.model";
import { TravelPlanModel } from "../travelPlan/travelPlan.model";
import { UserRole } from "../users/user.interface";
import { UserModel } from "../users/user.model";


//get stats data service
const getStatsData = async (decodedToken: IJwtTokenPayload) => {

    if (decodedToken.role === UserRole.ADMIN || decodedToken.role === UserRole.SUPER_ADMIN) {
        const totalTravelPlans = await TravelPlanModel.countDocuments();
        const totalUsers = await UserModel.countDocuments();
        const totalAdmins = await UserModel.countDocuments({ role: UserRole.ADMIN });
        const totalRegularUsers = await UserModel.countDocuments({ role: UserRole.USER });
        const totalSubscribedUsers = await ProfileModel.countDocuments({ isSubscribed: true });

        return {
            totalTravelPlans,
            totalUsers,
            totalAdmins,
            totalRegularUsers,
            totalSubscribedUsers
        };
    };

    if (decodedToken.role === UserRole.USER) {
        const totalTravelPlans = await TravelPlanModel.countDocuments({ user: decodedToken.userId });
        const upcomingTravelPlans = await TravelPlanModel.countDocuments({
            user: decodedToken.userId,
            startDate: { $gt: new Date() }
        });
        const completedTravelPlans = await TravelPlanModel.countDocuments({
            user: decodedToken.userId,
            endDate: { $lt: new Date() }
        });

        return {
            totalTravelPlans,
            upcomingTravelPlans,
            completedTravelPlans
        };
    }
};

export const StatsService = { getStatsData };