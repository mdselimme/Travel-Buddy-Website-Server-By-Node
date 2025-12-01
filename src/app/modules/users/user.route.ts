import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";


const router = Router();

// USER CREATE ROUTE 
router.post('/',
    validateZodSchema(UserValidation.userCreateValidation),
    UserController.registerUser
);

export const UserRouter = router;