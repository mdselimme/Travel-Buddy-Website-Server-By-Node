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
    checkAuth(UserRole.USER),
    multerUpload.single("file"),
    validateZodSchema(TravelPlanValidation.createATravelPlanSchema),
    TravelPlanController.createATravelPlan
);

//GET ALL TRAVEL PLANS ROUTE
router.get("/",
    TravelPlanController.getAllTravelPlans
);

//GET ALL TRAVEL PLANS USERS ROUTE
router.get("/user-plans",
    TravelPlanController.getAllTravelPlansForUsers
);

//GET TRAVEL PLANS CITIES ROUTE
router.get("/cities",
    TravelPlanController.getTravelPlansCities
);

//UPDATE A TRAVEL PLAN
router.patch("/:id",
    checkAuth(...Object.values(UserRole)),
    multerUpload.single("file"),
    validateZodSchema(TravelPlanValidation.updateATravelPlanSchema),
    TravelPlanController.updateATravelPlan
);

// GET MY TRAVEL PLANS ROUTE 
router.get("/my-plans",
    checkAuth(...Object.values(UserRole)),
    TravelPlanController.getMyTravelPlans
);

//router matches
router.get("/my-matches",
    checkAuth(...Object.values(UserRole)),
    TravelPlanController.getMyMatchesTravelPlans
);

//GET TRAVEL PLAN BY ID ROUTE
router.get("/:id",
    TravelPlanController.getSingleTravelPlan
);

//DELETE A TRAVEL PLAN ROUTE
router.delete("/:id",
    checkAuth(...Object.values(UserRole)),
    TravelPlanController.deleteATravelPlan
);


export const TravelPlanRouter = router;