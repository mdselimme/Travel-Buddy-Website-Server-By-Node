import httpStatus from 'http-status-codes';
import { Types } from "mongoose";
import { IPayment, PaymentStatus } from "../payment/payment.interface";
import { IBooking } from "./booking.interface"
import { BookingModel } from "./booking.model";
import { PaymentModel } from "../payment/payment.model";
import { getTransactionId } from "../../utils/getTransactionId";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { UserModel } from "../users/user.model";
import { TravelPlanModel } from "../travelPlan/travelPlan.model";
import ApiError from "../../utils/ApiError";
import { SSLCommerzService } from '../sslCommerz/sslCommerz.service';



//CREATE AN BOOKING SERVICE
const createABooking = async (bookingData: Partial<IBooking>) => {


    const transactionId = getTransactionId();

    const session = await BookingModel.startSession();
    session.startTransaction();

    try {

        const user = await UserModel.findById(bookingData.travelerId).session(session);

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User does not found");
        }

        const travelPlan = await TravelPlanModel.findById(bookingData.travelPlanId).session(session);

        if (!travelPlan) {
            throw new ApiError(httpStatus.NOT_FOUND, "Travel Plan does not found");
        }

        bookingData.totalCosts = travelPlan.budgetRange * (bookingData.totalMembers || 1);


        const booking = await BookingModel.create([bookingData], { session });

        const paymentData: Partial<IPayment> = {
            travelerId: bookingData.travelerId,
            travelPlanId: bookingData.travelPlanId,
            bookingId: booking[0]?._id as Types.ObjectId,
            transactionId: transactionId,
            status: PaymentStatus.PENDING,
            amount: bookingData.totalCosts as number,
        };

        const payment = await PaymentModel.create([paymentData], { session });

        const updatedBooking = await BookingModel.findByIdAndUpdate(
            booking[0]?._id,
            { paymentId: payment[0]?._id },
            { new: true, session }
        );

        const sslPayload: ISSLCommerz = {
            name: user?.fullName,
            email: user?.email,
            amount: Number(payment[0]?.amount),
            transactionId: transactionId,
            phoneNumber: user?.contactNumber as string,
            address: user?.address as string,
        };

        const sslPayment = await SSLCommerzService.sslPaymentInit(sslPayload);

        await session.commitTransaction();
        session.endSession();

        return {
            booking: updatedBooking,
            paymentUrl: sslPayment.GatewayPageURL,
        };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};





export const BookingService = {
    createABooking
}