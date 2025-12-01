import { Router } from "express";
import { UserController } from "./user.controller";


const router = Router();

// USER CREATE ROUTE 
router.post('/',
    UserController.registerUser
);

export const UserRouter = router;