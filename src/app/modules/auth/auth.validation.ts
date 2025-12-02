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
})

export const AuthValidation = {
    loginValidation,
    changePasswordValidation,
    emailValidation

};