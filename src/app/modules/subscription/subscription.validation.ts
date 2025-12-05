import z from "zod";
import { SubscriptionPlan } from "./subscription.interface";



//create subscription validation schema
const createSubscriptionSchema = z.object({
    plan: z.enum(Object.values(SubscriptionPlan), { message: `subscription must be one of ${Object.values(SubscriptionPlan).join(", ")} these.` }),
    price: z.number({ error: "Price is required" }).min(0, { message: "Price must be at least 0" }),
    currency: z.string({ error: "Currency is required" }),
    discount: z.number().min(0).optional(),
});

//update subscription validation schema
const updateSubscriptionSchema = z.object({
    plan: z.enum(Object.values(SubscriptionPlan), { message: "Invalid subscription plan" }).optional(),
    price: z.number({ error: "Price is required" }).min(0, { message: "Price must be at least 0" }).optional(),
    currency: z.string({ error: "Currency is required" }).optional(),
    discount: z.number().min(0).optional(),
});


export const SubscriptionValidation = {
    createSubscriptionSchema,
    updateSubscriptionSchema
};