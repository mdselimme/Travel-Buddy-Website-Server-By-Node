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
import { SubscriptionPlan } from '../subscription/subscription.interface';
import { IActiveStatus } from '../users/user.interface';

//INIT PAYMENT SERVICE
const initSubscriptionPayment = async (subscription: Types.ObjectId, user: Types.ObjectId) => {

    const transactionId = getTransactionId();

    const isUserExist = await UserModel.findById(user);

    if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    };

    if (!isUserExist.isVerified) {
        throw new ApiError(httpStatus.NOT_FOUND, "User is not verified. Please verify your account to proceed.");
    }

    if (isUserExist.isActive !== IActiveStatus.ACTIVE) {
        throw new ApiError(httpStatus.BAD_REQUEST, `User account is ${isUserExist.isActive}. Please contact support.`);
    }

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
// SUCCESS PAYMENT SERVICE
const handlePaymentSuccess = async (query: Record<string, string>) => {
    const { transactionId } = query;

    const session = await ProfileModel.startSession();
    session.startTransaction();

    try {
        // Find the payment record
        const paymentData = await PaymentModel.findOne({ transactionId });

        if (!paymentData) {
            throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
        }

        paymentData.status = PaymentStatus.PAID;
        const updatedPayment = await paymentData.save({ session });

        //find the profile and update subscription details
        const findProfile = await ProfileModel.findOne({ userId: paymentData.user });

        if (!findProfile) {
            throw new ApiError(httpStatus.NOT_FOUND, "Profile not found for the user");
        }

        // Calculate subscription dates
        const now = new Date();
        let subStartDate: Date;
        let subEndDate: Date;

        const subscriptionMonths = paymentData.subscriptionType === SubscriptionPlan.MONTHLY ? 1 : 12;

        // If user already has an active subscription, extend it
        if (findProfile.isSubscribed && findProfile.subEndDate && new Date(findProfile.subEndDate) > now) {
            subStartDate = findProfile.subStartDate as Date; // keep old start date
            subEndDate = new Date(findProfile.subEndDate);
            subEndDate.setMonth(subEndDate.getMonth() + subscriptionMonths);
        } else {
            // New subscription
            subStartDate = now;
            subEndDate = new Date(now);
            subEndDate.setMonth(now.getMonth() + subscriptionMonths);
        }
        // Update profile with subscription info
        findProfile.subStartDate = subStartDate;
        findProfile.subEndDate = subEndDate;
        findProfile.isSubscribed = true;

        await findProfile.save({ session });

        await PaymentModel.findByIdAndUpdate(
            paymentData._id,
            { subStartDate, subEndDate },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return updatedPayment;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
//FAIL PAYMENT SERVICE
const handlePaymentFail = async (query: Record<string, string>) => {
    const { transactionId } = query;

    const paymentData = await PaymentModel.findOne({ transactionId });
    if (!paymentData) {
        throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
    }
    paymentData.status = PaymentStatus.FAILED;
    const updatedPayment = await paymentData.save();
    return updatedPayment;
};


//CANCEL PAYMENT SERVICE
const handlePaymentCancel = async (query: Record<string, string>) => {
    const { transactionId } = query;

    const paymentData = await PaymentModel.findOne({ transactionId });
    if (!paymentData) {
        throw new ApiError(httpStatus.NOT_FOUND, "Payment data not found");
    }
    paymentData.status = PaymentStatus.CANCELLED;
    const updatedPayment = await paymentData.save();
    return updatedPayment;
};

export const PaymentService = {
    initSubscriptionPayment,
    handlePaymentSuccess,
    handlePaymentFail,
    handlePaymentCancel
};