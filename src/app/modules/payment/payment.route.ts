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
);

//GET PAYMENT BY USER ROUTE
router.get("/me",
    checkAuth(...Object.values(UserRole)),
    PaymentController.getMePayments
);
//GET ALL PAYMENTS ROUTE
// router.get("/",
//     checkAuth(UserRole.ADMIN),
//     PaymentController.getAllPayments
// );

//SUCCESS PAYMENT ROUTE
router.post("/success",
    PaymentController.handlePaymentSuccess
);

//SUCCESS PAYMENT ROUTE
router.post("/fail",
    PaymentController.handlePaymentFail
);

//SUCCESS PAYMENT ROUTE
router.post("/cancel",
    PaymentController.handlePaymentCancel
);

//VALIDATE PAYMENT ROUTE
router.post("/validate-payment",
    PaymentController.validatePayment
);


export const PaymentRouter = router;