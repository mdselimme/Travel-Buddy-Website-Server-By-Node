import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { AuthValidation } from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";


const router = Router();

// AUTH LOGIN ROUTE
router.post('/login',
    validateZodSchema(AuthValidation.loginValidation),
    AuthController.logInUser
);

// AUTH RESET PASSWORD ROUTE
router.post('/reset-password',
    validateZodSchema(AuthValidation.forgotPasswordValidation),
    AuthController.forgotPasswordReset
);

// AUTH CHANGE PASSWORD ROUTE
router.post('/change-password',
    validateZodSchema(AuthValidation.changePasswordValidation),
    checkAuth(...Object.values(UserRole)),
    AuthController.changePassword
);

// AUTH EMAIL VERIFICATION ROUTE
router.post('/verify-email-send',
    validateZodSchema(AuthValidation.emailValidation),
    AuthController.emailSendVerification
);

//VERIFY EMAIL
router.post('/verify-email',
    validateZodSchema(AuthValidation.verifyEmailValidation),
    AuthController.verifyEmailOtpVerification
);


// AUTH FORGOT PASSWORD ROUTE
router.post('/forgot-password',
    validateZodSchema(AuthValidation.emailValidation),
    AuthController.forgotPassword
);

// AUTH REFRESH TOKEN ROUTE
router.post('/refresh-token',
    checkAuth(...Object.values(UserRole)),
    AuthController.undoRefreshToken
);

// AUTH LOGOUT ROUTE
router.post('/logout',
    AuthController.logOutUser
);

export const AuthRouter = router;