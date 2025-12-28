import z from "zod";


// CREATE REVIEW VALIDATION 
const createReviewZodSchema = z.object({
    travelPlan: z.string({ error: "Travel Plan is required & must be an ObjectId." }),
    reviewer: z.string({ error: "Reviewer is required & must be an ObjectId." }),
    reviewed: z.string({ error: "Reviewed is required & must be an ObjectId." }),
    rating: z.number({ error: "Rating is required" }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    description: z.string({ error: "Description is required" }).min(10, "Description must be at least 10 characters long"),
});

//UPDATE REVIEW VALIDATION
const updateReviewZodSchema = z.object({
    rating: z.number({ error: "Rating must be a number" }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
    description: z.string({ error: "Description must be a string" }).min(10, "Description must be at least 10 characters long").optional(),
});

export const ReviewValidated = {
    createReviewZodSchema,
    updateReviewZodSchema,
};