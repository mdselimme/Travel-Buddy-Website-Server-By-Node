import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { ProfileController } from "./profile.controller";


const router = Router();

router.get("/me",
    checkAuth(...Object.values(UserRole)),
    ProfileController.getProfileById
);

export const ProfileRouter = router;