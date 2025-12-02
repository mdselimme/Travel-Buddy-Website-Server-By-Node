/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import { envVars } from '../../config/envVariable.config';
import path from 'path';
import ejs from 'ejs';
import ApiError from './ApiError';


interface ISendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}



const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.SMTP.SMTP_USER,
        pass: envVars.SMTP.SMTP_PASS
    },
    port: Number(envVars.SMTP.SMTP_PORT),
    host: envVars.SMTP.SMTP_HOST,
});


export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments,
}: ISendEmailOptions) => {

    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envVars.SMTP.SMTP_USER,
            to,
            subject,
            html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });
        console.log(`\u2709\uFE0F Email send to ${to}: ${info.messageId}`)
    } catch (error: any) {
        console.log('Email sending error: ', error.message);
        throw new ApiError(401, "Email sending error.")
    }
};

