import z from "zod";
// USER CREATE VALIDATION
const userCreateValidation = z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
    email: z.email({ error: 'Invalid email address' }),
    password: z
        .string({ error: "password must be string." })
        .min(8, { message: "Password minimum 8 characters long." })
        .regex(/^(?=.*[A-Z])/, { message: "Password must be contain at least 1 uppercase letter" })
        .regex(/^(?=.*[a-z])/, { message: "Password must be contain at least 1 lowercase letter" })
        .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must be contain at least 1 special character." })
        .regex(/^(?=.*\d)/, { message: "Password must be contain at least 1 number" }),
});

export const UserValidation = {
    userCreateValidation,
}