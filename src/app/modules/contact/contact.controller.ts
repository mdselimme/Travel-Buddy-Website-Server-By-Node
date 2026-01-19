import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express"
import { sendEmail } from "../../utils/sendEmail"
import catchAsync from '../../utils/catchAsync';
import ApiResponse from '../../utils/ApiResponse';
import { envVars } from '../../../config/envVariable.config';


const sendContactEmail = catchAsync(async (req: Request, res: Response) => {

    const { name, email, subject, message } = req.body;


    await sendEmail({
        to: envVars.SMTP.SMTP_USER,
        subject: subject,
        templateName: "contactForm",
        templateData: {
            name, email, subject, message
        }
    });

    ApiResponse(res, {
        success: true,
        statusCode: httpStatusCodes.OK,
        data: null,
        message: "Contact Form Submitted Successfully."
    });
});


export const ContactController = { sendContactEmail }