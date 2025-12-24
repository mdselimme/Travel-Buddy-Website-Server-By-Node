import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { ProfileController } from "./profile.controller";


const router = Router();

//GET MY PROFILE ROUTE
router.get("/me",
    checkAuth(...Object.values(UserRole)),
    ProfileController.getProfileById
);

//GET ALL PROFILES ROUTE
router.get("/",
    ProfileController.getAllProfiles
);

// GET PROFILE BY USER ID ROUTE 
router.get("/:id",
    ProfileController.getProfileByUserId
);

export const ProfileRouter = router;