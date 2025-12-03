import z from "zod";
import { UserRole } from "./user.interface";
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

// USER UPDATE VALIDATION
const userUpdateValidation = z.object({
    userId: z.string({ error: "User ID must be a string of objectId" }),
    fullName: z.string().min(3, 'Full name must be at least 3 characters long').optional(),
    email: z.email({ error: 'Invalid email address' }).optional(),
    contactNumber: z
        .string()
        .length(11, { message: "Phone number must be exactly 11 digits" })
        .regex(/^01\d{9}$/, {
            message:
                "Invalid Bangladeshi phone number. It must start with '01' and be exactly 11 digits long.",
        }).optional(),
    address: z.string({ error: "address must be a string" }).optional(),
    visitedCountries: z.array(z.string({ error: "visited countries must be a string array" })).optional(),
    currentLocation: z.string({ error: "current location must be a string" }).optional(),
    travelsInterests: z.array(z.string({ error: "travel interests must be a string array" })).optional(),
    aboutMe: z.string({ error: "about me must be a string" }).optional(),
});

//User Role Update Validation
const userRoleUpdateValidation = z.object({
    userId: z.string({ error: "User ID must be a string of objectId" }),
    role: z.enum(Object.values(UserRole), { error: "Invalid user role! Value must be from " + Object.values(UserRole).join(", ") + "the given options." }),
});

export const UserValidation = {
    userCreateValidation,
    userUpdateValidation,
    userRoleUpdateValidation,
}