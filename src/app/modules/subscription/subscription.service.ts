import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ISubscription } from "./subscription.interface";
import { SubscriptionModel } from "./subscription.model";
import { ProfileModel } from "../profiles/profile.model";



//create subscription service
const createSubscriptionService = async (subscriptionData: Partial<ISubscription>) => {

    const createSubscription = await SubscriptionModel.create(subscriptionData);

    return createSubscription;

};

//UPDATE SUBSCRIPTION SERVICE
const updateSubscriptionService = async (id: string, updateData: Partial<ISubscription>) => {

    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
        throw new ApiError(httpStatus.NOT_FOUND, "Subscription plan not found");
    }

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(id, updateData, { new: true });
    return updatedSubscription;
};

//GET ALL SUBSCRIPTION SERVICE
const getAllSubscriptionsService = async (): Promise<ISubscription[]> => {
    const subscriptions = await SubscriptionModel.find()
    return subscriptions;
};

//GET A SUBSCRIPTION SERVICE
const getSubscriptionService = async (id: string): Promise<ISubscription | null> => {
    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
        throw new ApiError(httpStatus.NOT_FOUND, "Subscription plan not found");
    }
    return subscription;
};

//SUBSCRIPTION SOFT DELETE SERVICE
const softDeleteSubscriptionService = async (id: string): Promise<ISubscription | null> => {
    const subscription = await SubscriptionModel.findById(id);
    if (!subscription) {
        throw new ApiError(httpStatus.NOT_FOUND, "Subscription plan not found");
    }

    subscription.isDeleted = true;
    await subscription.save();

    return subscription;
};

//CHECK AND UPDATE EXPIRED SUBSCRIPTIONS SERVICE
const checkAndUpdateExpiredSubscriptionsService = async () => {
    const currentDate = new Date();

    // Find all profiles where subscription has ended
    const expiredProfiles = await ProfileModel.find({
        isSubscribed: true,
        subEndDate: { $lte: currentDate }
    });

    if (expiredProfiles.length === 0) {
        return { message: "No expired subscriptions found", updatedCount: 0 };
    }

    // Update all expired profiles
    const updateResult = await ProfileModel.updateMany(
        {
            isSubscribed: true,
            subEndDate: { $lte: currentDate }
        },
        {
            $set: {
                isSubscribed: false,
                subStartDate: null,
                subEndDate: null
            }
        }
    );

    return {
        message: "Expired subscriptions updated successfully",
        updatedCount: updateResult.modifiedCount,
        expiredProfiles: expiredProfiles.map(profile => ({
            profileId: profile._id,
            email: profile.email,
            endDate: profile.subEndDate
        }))
    };
};

export const SubscriptionService = {
    createSubscriptionService,
    updateSubscriptionService,
    getAllSubscriptionsService,
    getSubscriptionService,
    softDeleteSubscriptionService,
    checkAndUpdateExpiredSubscriptionsService
}