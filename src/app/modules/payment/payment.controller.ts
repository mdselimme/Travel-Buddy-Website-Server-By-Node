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
});

//SUCCESS PAYMENT CONTROLLER
const handlePaymentSuccess = catchAsync(async (req: Request, res: Response) => {

    const result = await PaymentService.handlePaymentSuccess(req.query as Record<string, string>);

    ApiResponse(res, {
        success: true,
        message: "Payment is successful",
        statusCode: httpStatus.OK,
        data: result,
    });
});

//FAIL PAYMENT CONTROLLER
const handlePaymentFail = catchAsync(async (req: Request, res: Response) => {

    const result = await PaymentService.handlePaymentFail(req.query as Record<string, string>);

    ApiResponse(res, {
        success: false,
        message: "Payment failed",
        statusCode: httpStatus.BAD_REQUEST,
        data: result,
    });
});

//CANCEL PAYMENT CONTROLLER
const handlePaymentCancel = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.handlePaymentCancel(req.query as Record<string, string>);
    ApiResponse(res, {
        success: false,
        message: "Payment was cancelled",
        statusCode: httpStatus.OK,
        data: result,
    });
});

export const PaymentController = {
    initSubscriptionPayment,
    handlePaymentSuccess,
    handlePaymentFail,
    handlePaymentCancel
}