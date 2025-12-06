import httpStatus from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../../config/envVariable.config";
import ApiError from "../../utils/ApiError";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios";


//SSL COMMERZ INIT
const sslPaymentInit = async (payload: ISSLCommerz) => {
    try {
        const data = {
            store_id: process.env.SSL_COMMERZ_STORE_ID,
            store_passwd: process.env.SSL_COMMERZ_STORE_PASS,
            total_amount: payload.amount,
            currency: 'BDT',
            tran_id: payload.transactionId,
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'N/A',
            product_name: 'Tour Service',
            product_category: 'Entertainment',
            product_profile: 'general',
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: 'N/A',
            cus_city: 'N/A',
            cus_state: 'N/A',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: payload.phoneNumber,
            cus_fax: 'N/A',
            ship_name: 'N/A',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 'N/A',
            ship_country: 'Bangladesh',
        };
        const response = await axios({
            method: 'POST',
            url: envVars.SSL.SSL_COMMERZ_PAYMENT_API,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        return response.data;
    } catch (error: any) {
        console.log(`Payment error occured: ${error.message}`)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to initiate SSL Commerz payment: ' + error.message);
    }
};

export const SSLCommerzService = {
    sslPaymentInit,
};