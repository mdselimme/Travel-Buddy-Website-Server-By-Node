import z from "zod";


//LOGIN VALIDATION
const loginValidation = z.object({
    email: z.string({
        error: 'Email is required and string',
    }),
    password: z.string({
        error: 'Password is required and string',
    }),
});

//Email VALIDATION
const emailValidation = z.object({
    email: z.string({
        error: 'Email is required and string',
    }),
});
//Email VALIDATION
const verifyEmailValidation = z.object({
    email: z.string({
        error: 'Email is required and string',
    }),
    otp: z.string({
        error: 'OTP is required and string',
    }).length(6, { error: "OTP must be exactly 6 digits long " })
});
//Forgot password validation
const forgotPasswordValidation = z.object({
    token: z.string({
        error: 'Token is required and string',
    }),
    password: z
        .string({ error: "password must be string & required." })
        .min(8, { message: "Password minimum 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must be contain at least 1 uppercase letter" })
        .regex(/^(?=.*[a-z])/, { message: "Password must be contain at least 1 lowercase letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must be contain at least 1 special character." })
        .regex(/^(?=.*\d)/, { message: "Password must be contain at least 1 number" }),
});

//CHANGE PASSWORD VALIDATION
const changePasswordValidation = z.object({
    oldPassword: z.string({
        error: 'Old Password is required and string',
    }),
    newPassword: z
        .string({ error: "password must be string." })
        .min(8, { message: "Password minimum 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must be contain at least 1 uppercase letter" })
        .regex(/^(?=.*[a-z])/, { message: "Password must be contain at least 1 lowercase letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must be contain at least 1 special character." })
        .regex(/^(?=.*\d)/, { message: "Password must be contain at least 1 number" }),
});

export const AuthValidation = {
    loginValidation,
    changePasswordValidation,
    emailValidation,
    verifyEmailValidation,
    forgotPasswordValidation
};