import z from "zod";



//travel type create validation
const createTravelTypeValidation = z.object({
    typeName: z.string({
        error: "Type name is required & must be a string"
    })
});

//travel type update validation
const updateTravelTypeValidation = z.object({
    typeName: z.string().optional()
});

export const TravelTypeValidation = {
    createTravelTypeValidation,
    updateTravelTypeValidation
};