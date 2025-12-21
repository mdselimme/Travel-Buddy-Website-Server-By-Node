import { Router } from "express";
import { TravelTypeController } from "./travelType.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { TravelTypeValidation } from "./travelType.validation";



const router = Router();

//CREATE TRAVEL TYPE ROUTE
router.post('/',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateZodSchema(TravelTypeValidation.createTravelTypeValidation),
    TravelTypeController.createTravelTypeController);

//UPDATE TRAVEL TYPE ROUTE
router.patch('/:id',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateZodSchema(TravelTypeValidation.updateTravelTypeValidation),
    TravelTypeController.updateTravelTypeController);

//GET ALL TRAVEL TYPES ROUTE
router.get('/',
    TravelTypeController.getAllTravelTypesController
);

//GET SINGLE TRAVEL TYPE ROUTE
router.get('/:id',
    TravelTypeController.getSingleTravelTypeController
);

//DELETE TRAVEL TYPE ROUTE
router.delete('/:id',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    TravelTypeController.deleteTravelTypeController);

export const TravelTypeRouter = router;