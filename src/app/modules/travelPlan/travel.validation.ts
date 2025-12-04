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

export const TravelPlanValidation = {
    createATravelPlanSchema
};