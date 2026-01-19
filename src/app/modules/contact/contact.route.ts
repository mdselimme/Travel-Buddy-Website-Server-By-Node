import { Router } from "express";
import { contactFormSchema } from "./contact.validation";
import { ContactController } from "./contact.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";



const router = Router();

router.post("/send",
    validateZodSchema(contactFormSchema),
    ContactController.sendContactEmail
)

export const ContactRouter = router;