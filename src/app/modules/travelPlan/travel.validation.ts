import z from "zod";
import { TravelPlanStatus } from "./travelPlan.interface";

//CREATE A TRAVEL PLAN VALIDATION
const createATravelPlanSchema = z.object({
    user: z.string({ error: "User ID is required & must be a string" }),
    travelTitle: z.string({ error: "Travel Title is required & must be a string" }),
    destination: z.object({
        city: z.string({ error: "City is required & must be a string" }),
        country: z.string({ error: "Country is required & must be a string" })
    }),
    startDate: z.string({ error: "Start Date is required & must be a string and valid date format" }),
    endDate: z.string({ error: "End Date is required & must be a string and valid date format" }),
    budgetRange: z.object({
        min: z.number({ error: "Minimum budget is required & must be a number" }),
        max: z.number({ error: "Maximum budget is required & must be a number" })
    }),
    travelTypes: z.array(z.string({ error: "Each travel type must be a string & must be a valid ObjectId" }), { error: "Travel Types is required & must be an array of strings" }),
    travelDescription: z.string({ error: "Travel Description must be a string" }),
    itinerary: z.array(z.string({ error: "Each itinerary item must be a string" }), { error: "Itinerary is required & must be an array of strings" }),
});

//UPDATE A TRAVEL PLAN VALIDATION
const updateATravelPlanSchema = z.object({
    travelTitle: z.string({ error: "Travel Title is required & must be a string" }).optional(),
    destination: z.object({
        city: z.string({ error: "City is required & must be a string" }).optional(),
        country: z.string({ error: "Country is required & must be a string" }).optional()
    }).optional(),
    startDate: z.string({ error: "Start Date is required & must be a string and valid date format" }).optional(),
    endDate: z.string({ error: "End Date is required & must be a string and valid date format" }).optional(),
    budgetRange: z.object({
        min: z.number({ error: "Minimum budget is required & must be a number" }).optional(),
        max: z.number({ error: "Maximum budget is required & must be a number" }).optional()
    }).optional(),
    travelTypes: z.array(z.string({ error: "Each travel type must be a string & must be a valid ObjectId" }), { error: "Travel Types is required & must be an array of strings" }).optional(),
    travelDescription: z.string({ error: "Travel Description must be a string" }).optional(),
    itinerary: z.array(z.string({ error: "Each itinerary item must be a string" }), { error: "Itinerary is required & must be an array of strings" }).optional(),
    isVisible: z.boolean({ error: "Is Visible must be a boolean" }).optional(),
    travelPlanStatus: z.enum(Object.values(TravelPlanStatus), {
        error: `
        travel plan status must be ${Object.values(TravelPlanStatus).join(", ")} from these.`
    }).optional()
});

export const TravelPlanValidation = {
    createATravelPlanSchema,
    updateATravelPlanSchema
};