import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { PaymentController } from "./payment.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { PaymentValidation } from "./payment.validation";

const router = Router();

//INIT PAYMENT ROUTE
router.post("/init",
    checkAuth(...Object.values(UserRole)),
    validateZodSchema(PaymentValidation.paymentValidateSchema),
    PaymentController.initSubscriptionPayment
)


export const PaymentRouter = router;