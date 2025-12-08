import z from "zod";
import { MatchStatus } from "./matches.interface";



//CREATE MATCH VALIDATION
const createMatchZodSchema = z.object({
    travelPlanId: z.string({ error: "Travel Plan ID is required & must be a ObjectId" }),
    senderId: z.string({ error: "Sender ID is required & must be a ObjectId" }),
    receiverId: z.string({ error: "Receiver ID is required & must be a ObjectId" }),
});

//UPDATE MATCH VALIDATION
const updateMatchZodSchema = z.object({
    status: z.enum(Object.values(MatchStatus), { error: `Status must be one of: ${Object.values(MatchStatus).join(", ")} these.` })
});

export const MatchesValidated = {
    createMatchZodSchema,
    updateMatchZodSchema
};