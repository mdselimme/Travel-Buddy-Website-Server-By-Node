import z from "zod";



//travel type create validation
const createTravelTypeValidation = z.object({
    typeName: z.string({
        error: "Type name is required & must be a string"
    }).min(3, { error: "Type name must be at least 3 characters long" })
});

//travel type update validation
const updateTravelTypeValidation = z.object({
    typeName: z.string().min(3,
        { error: "Type name must be at least 3 characters long" }
    ).optional()
});

export const TravelTypeValidation = {
    createTravelTypeValidation,
    updateTravelTypeValidation
};