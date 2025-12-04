import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { TravelPlanValidation } from "./travel.validation";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { TravelPlanController } from "./travelPlan.controller";
import { multerUpload } from "../../../config/multer.config";



const router = Router();

//CREATE A NEW TRAVEL PLAN
router.post("/create-plan",
    checkAuth(...Object.values(UserRole)),
    multerUpload.single("file"),
    validateZodSchema(TravelPlanValidation.createATravelPlanSchema),
    TravelPlanController.createATravelPlan
);

//GET ALL TRAVEL PLANS ROUTE
router.get("/",
    TravelPlanController.getAllTravelPlans
);

//UPDATE A TRAVEL PLAN
router.patch("/:id",
    checkAuth(...Object.values(UserRole)),
    multerUpload.single("file"),
    validateZodSchema(TravelPlanValidation.updateATravelPlanSchema),
    TravelPlanController.updateATravelPlan
);

//GET TRAVEL PLAN BY ID ROUTE
router.get("/:id",
    checkAuth(...Object.values(UserRole)),
    TravelPlanController.getSingleTravelPlan
);


export const TravelPlanRouter = router;