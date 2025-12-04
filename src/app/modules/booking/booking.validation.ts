import z from "zod";

// CREATE BOOKING VALIDATION
const createBookingZodSchema = z.object({
    travelerId: z.string().nonempty("Traveler ID is required"),
    travelPlanId: z.string().nonempty("Travel Plan ID is required"),
    totalMembers: z.number({ error: "Total members must be a number" }).min(1, "At least one member is required"),
});

export const BookingValidation = {
    createBookingZodSchema,
};