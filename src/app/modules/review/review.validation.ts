import z from "zod";


// CREATE REVIEW VALIDATION 
const createReviewZodSchema = z.object({
    travel: z.string({ error: "Travel is required & must be an ObjectId." }),
    user: z.string({ error: "User is required & must be an ObjectId." }),
    traveler: z.string({ error: "Traveler is required & must be an ObjectId." }),
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