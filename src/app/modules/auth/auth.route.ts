import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { AuthValidation } from "./auth.validation";


const router = Router();

// AUTH LOGIN ROUTE
router.post('/login',
    validateZodSchema(AuthValidation.loginValidation),
    AuthController.logInUser
);

// // AUTH RESET PASSWORD ROUTE
// router.post('/reset-password',
//     AuthController.resetPassword
// );

// AUTH CHANGE PASSWORD ROUTE
router.post('/change-password',
    validateZodSchema(AuthValidation.changePasswordValidation),
    AuthController.changePassword
);

// // AUTH EMAIL VERIFICATION ROUTE
// router.post('/verify-email',
//     AuthController.verifyEmail
// );

// // AUTH FORGOT PASSWORD ROUTE
// router.post('/forgot-password',
//     AuthController.resetPasswordVerify
// );

// // AUTH REFRESH TOKEN ROUTE
// router.post('/refresh-token',
//     AuthController.refreshToken
// );

// // AUTH LOGOUT ROUTE
// router.post('/logout',
//     AuthController.logoutUser
// );

export const AuthRouter = router;