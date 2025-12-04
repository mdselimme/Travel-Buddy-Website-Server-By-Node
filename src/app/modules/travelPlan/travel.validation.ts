import z from "zod";

//CREATE A TRAVEL PLAN VALIDATION
const createATravelPlanSchema = z.object({
    travelTitle: z.string({ error: "Travel Title is required & must be a string" }),
    creatorId: z.string({ error: "Creator ID is required" }),
    destination: z.string({ error: "Destination is required & must be a string" }),
    startDate: z.string({ error: "Start Date is required & must be a string and valid date format" }),
    endDate: z.string({ error: "End Date is required & must be a string and valid date format" }),
    budgetRange: z.number({ error: "Budget Range is required & must be a number" }),
    travelTypes: z.array(z.string({ error: "Each travel type must be a string" }), { error: "Travel Types is required & must be an array of strings" }),
});

//UPDATE A TRAVEL PLAN VALIDATION
const updateATravelPlanSchema = z.object({
    travelTitle: z.string({ error: "Travel Title must be a string" }).optional(),
    destination: z.string({ error: "Destination must be a string" }).optional(),
    accommodations: z.string({ error: "Accommodations must be a string" }).optional(),
    travelDescription: z.string({ error: "Travel Description must be a string" }).optional(),
    activities: z.array(z.string({ error: "Each activity must be a string" }), { error: "Activities must be an array of strings" }).optional(),
    startDate: z.string({ error: "Start Date must be a string and valid date format" }).optional(),
    endDate: z.string({ error: "End Date must be a string and valid date format" }).optional(),
    budgetRange: z.number({ error: "Budget Range must be a number" }).optional(),
    travelTypes: z.array(z.string({ error: "Each travel type must be a string" }), { error: "Travel Types must be an array of strings" }).optional(),
});

export const TravelPlanValidation = {
    createATravelPlanSchema,
    updateATravelPlanSchema
};