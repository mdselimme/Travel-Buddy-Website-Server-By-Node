import crypto from 'crypto';

export const OTP_EXPIRATION = 60 * 5;

export const generateOtpCode = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};