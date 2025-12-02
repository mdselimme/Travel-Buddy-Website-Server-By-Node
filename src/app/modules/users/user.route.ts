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

// USER UPDATE ROUTE
router.patch('/',
    validateZodSchema(UserValidation.userUpdateValidation),
    UserController.updateUser
);

// USER ROLE UPDATE ROUTE
router.patch('/role',
    validateZodSchema(UserValidation.userRoleUpdateValidation),
    UserController.updateUserRole
);

export const UserRouter = router;