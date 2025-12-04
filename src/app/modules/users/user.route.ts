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

//GET ALL USER ROUTE
router.get('/',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    UserController.getAllUsers
);

//USER PROFILE GET ROUTE
router.get('/me',
    checkAuth(...Object.values(UserRole)),
    UserController.getUserProfile
);

//GET USER BY ID ROUTE
router.get('/:id',
    checkAuth(...Object.values(UserRole)),
    UserController.getUserById
);

// USER ROLE UPDATE ROUTE
router.patch('/update-role',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateZodSchema(UserValidation.userRoleUpdateValidation),
    UserController.updateUserRole
);

//USER PROFILE STATUS UPDATE ROUTE
router.patch('/update-status/:id',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateZodSchema(UserValidation.userStatusUpdateValidation),
    UserController.updateUserStatus
);

// USER DELETE ROUTE
// router.delete('/:id',
//     checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     UserController.deleteUser
// );



export const UserRouter = router;