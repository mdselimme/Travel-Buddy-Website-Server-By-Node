import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse";
import catchAsync from "../../utils/catchAsync"
import { PaymentService } from "./payment.service";


//INIT PAYMENT CONTROLLER
const initSubscriptionPayment = catchAsync(async (req: Request, res: Response) => {
    const { subscription, user } = req.body;
    const result = await PaymentService.initSubscriptionPayment(subscription, user);
    ApiResponse(res, {
        success: true,
        message: "Payment initiated successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
})
export const PaymentController = {
    initSubscriptionPayment
}