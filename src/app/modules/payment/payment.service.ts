import httpStatus from 'http-status-codes';
import { Types } from "mongoose"
import { PaymentModel } from "./payment.model"
import { UserModel } from "../users/user.model";
import ApiError from "../../utils/ApiError";
import { SubscriptionModel } from '../subscription/subscription.model';
import { getTransactionId } from '../../utils/getTransactionId';
import { PaymentStatus } from './payment.interface';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { ProfileModel } from '../profiles/profile.model';
import { SSLCommerzService } from '../sslCommerz/sslCommerz.service';

//INIT PAYMENT SERVICE
const initSubscriptionPayment = async (subscription: Types.ObjectId, user: Types.ObjectId) => {

    const transactionId = getTransactionId();

    const isUserExist = await UserModel.findById(user);

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    };

    const profileData = await ProfileModel.findById(isUserExist.profile);

    if (!profileData) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile data not found for the user");
    }

    if (!profileData.contactNumber || !profileData.address) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Incomplete profile data. Please update your profile with contact number, and address.");
    }

    const isSubscriptionExist = await SubscriptionModel.findById(subscription);

    if (!isSubscriptionExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
    }

    const sslPayload: ISSLCommerz = {
        amount: isSubscriptionExist.price,
        transactionId,
        name: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.contactNumber as string,
        address: profileData.address as string,
    };

    const sslPayment = await SSLCommerzService.sslPaymentInit(sslPayload);

    const paymentData = {
        user,
        subscription,
        transactionId,
        subscriptionType: isSubscriptionExist.plan,
        status: PaymentStatus.PENDING,
        amount: isSubscriptionExist.price,
    };

    const paymentCreate = await PaymentModel.create(paymentData);

    return {
        paymentUrl: sslPayment.GatewayPageURL,
        payment: paymentCreate
    };
};

//SUCCESS PAYMENT SERVICE
const handlePaymentSuccess = async (query: Record<string, string>) => {

    const { transactionId } = query;
    const session = await ProfileModel.startSession();
    session.startTransaction();

    try {
        const paymentData = await PaymentModel.findOne({ transactionId });

        if (!paymentData) {
            throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
        }
        paymentData.status = PaymentStatus.PAID;

        const updatedPayment = await paymentData.save({ session });

        const findProfile = await ProfileModel.findOne({ userId: paymentData.user });

        if (!findProfile) {
            throw new ApiError(httpStatus.NOT_FOUND, "Profile not found for the user");
        }

        const subStartDate = new Date();

        const subEndDate = paymentData.subscriptionType === "MONTHLY" ?
            new Date(subStartDate.getFullYear(), subStartDate.getMonth() + 1, subStartDate.getDate()) :
            new Date(subStartDate.getFullYear() + 1, subStartDate.getMonth(), subStartDate.getDate());

        findProfile.subStartDate = subStartDate;
        findProfile.subEndDate = subEndDate;
        findProfile.isSubscribed = true;

        await findProfile.save({ session });

        await session.commitTransaction();
        session.endSession();
        return updatedPayment;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const PaymentService = {
    initSubscriptionPayment,
    handlePaymentSuccess
}