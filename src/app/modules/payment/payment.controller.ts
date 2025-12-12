import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse";
import catchAsync from "../../utils/catchAsync"
import { PaymentService } from "./payment.service";
import { SSLCommerzService } from '../sslCommerz/sslCommerz.service';
import { envVars } from '../../../config/envVariable.config';


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

    const query = req.query;

    const result = await PaymentService.handlePaymentSuccess(req.query as Record<string, string>);

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
});

//FAIL PAYMENT CONTROLLER
const handlePaymentFail = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentService.handlePaymentFail(req.query as Record<string, string>);
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
});

//CANCEL PAYMENT CONTROLLER
const handlePaymentCancel = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentService.handlePaymentCancel(req.query as Record<string, string>);
    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
});

//GET ME PAYMENTS CONTROLLER
const getMePayments = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const result = await PaymentService.getMePaymentService(decodedToken.userId);
    ApiResponse(res, {
        success: true,
        message: "User payments fetched successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
});

//VALIDATE PAYMENT CONTROLLER
const validatePayment = catchAsync(async (req: Request, res: Response) => {
    await SSLCommerzService.validatePayment(req.body);
    ApiResponse(res, {
        success: true,
        message: "Payment validated successfully",
        statusCode: httpStatus.OK,
        data: null,
    });
});

export const PaymentController = {
    initSubscriptionPayment,
    handlePaymentSuccess,
    handlePaymentFail,
    handlePaymentCancel,
    validatePayment,
    getMePayments,
}