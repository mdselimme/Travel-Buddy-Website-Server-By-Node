import z from "zod";


// CREATE REVIEW VALIDATION 
const createReviewZodSchema = z.object({
    arrangedBy: z.string({ error: "ArrangedBy is required & must be an ObjectId." }),
    travelPlan: z.string({ error: "TravelPlan is required & must be an ObjectId." }),
    traveler: z.string({ error: "Traveler is required & must be an ObjectId." }),
    arrangedByRating: z.number({ error: "Rating is required" }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    arrangedByDescription: z.string({ error: "Description is required" }).min(10, "Description must be at least 10 characters long"),
});

//UPDATE REVIEW VALIDATION
const updateReviewZodSchema = z.object({
    arrangedByRating: z.number({ error: "Rating must be a number" }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
    arrangedByDescription: z.string({ error: "Description must be a string" }).min(10, "Description must be at least 10 characters long").optional(),
    travelerRating: z.number({ error: "Rating must be a number" }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
    travelerDescription: z.string({ error: "Description must be a string" }).min(10, "Description must be at least 10 characters long").optional(),
});

export const ReviewValidated = {
    createReviewZodSchema,
    updateReviewZodSchema,
};