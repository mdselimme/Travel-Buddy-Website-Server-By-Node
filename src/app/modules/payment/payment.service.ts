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
        status: PaymentStatus.PENDING,
        amount: isSubscriptionExist.price,
    };

    const paymentCreate = await PaymentModel.create(paymentData);

    return {
        paymentUrl: sslPayment.GatewayPageURL,
        payment: paymentCreate
    };
};

export const PaymentService = {
    initSubscriptionPayment
}