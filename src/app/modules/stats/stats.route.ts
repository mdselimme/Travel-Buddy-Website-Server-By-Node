import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { StatsController } from "./stats.controller";




const router = Router();

router.get("/",
    checkAuth(...Object.values(UserRole)),
    StatsController.getStats
)

export const StatsRouter = router;