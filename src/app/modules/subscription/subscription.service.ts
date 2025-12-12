import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ISubscription } from "./subscription.interface";
import { SubscriptionModel } from "./subscription.model";



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

export const SubscriptionService = {
    createSubscriptionService,
    updateSubscriptionService,
    getAllSubscriptionsService,
    getSubscriptionService,
    softDeleteSubscriptionService
}