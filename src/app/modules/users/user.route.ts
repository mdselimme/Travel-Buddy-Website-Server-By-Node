import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";
import { multerUpload } from "../../../config/multer.config";


const router = Router();

// USER CREATE ROUTE 
router.post('/',
    validateZodSchema(UserValidation.userCreateValidation),
    UserController.registerUser
);

// USER UPDATE ROUTE
router.patch('/',
    checkAuth(...Object.values(UserRole)),
    multerUpload.single("file"),
    validateZodSchema(UserValidation.userUpdateValidation),
    UserController.updateUser
);

// USER ROLE UPDATE ROUTE
router.patch('/role',
    checkAuth(UserRole.SUPER_ADMIN),
    validateZodSchema(UserValidation.userRoleUpdateValidation),
    UserController.updateUserRole
);

export const UserRouter = router;