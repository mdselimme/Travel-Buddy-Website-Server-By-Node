import z from "zod";


//INIT PAYMENT VALIDATION
const paymentValidateSchema = z.object({
    subscription: z.string({ error: "Invalid subscription Object ID" }),
    user: z.string({ error: "Invalid user Object ID" })
});

export const PaymentValidation = {
    paymentValidateSchema
};