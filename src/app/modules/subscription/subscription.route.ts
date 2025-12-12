import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { SubscriptionValidation } from "./subscription.validation";
import { SubscriptionController } from "./subscription.controller";



const router = Router();

//CREATE SUBSCRIPTION PLAN
router.post("/create",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateZodSchema(SubscriptionValidation.createSubscriptionSchema),
    SubscriptionController.createSubscriptionPlan
);

//UPDATE SUBSCRIPTION PLAN
router.patch("/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateZodSchema(SubscriptionValidation.updateSubscriptionSchema),
    SubscriptionController.updateSubscriptionPlan
);


//GET ALL SUBSCRIPTION PLANS
router.get("/",
    SubscriptionController.getAllSubscriptionPlans
);

//GET A SUBSCRIPTION PLAN
router.get("/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    SubscriptionController.getSubscriptionPlan
);

//SOFT DELETE SUBSCRIPTION PLAN
router.delete("/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    SubscriptionController.softDeleteSubscriptionPlan
);

export const SubscriptionRouter = router;