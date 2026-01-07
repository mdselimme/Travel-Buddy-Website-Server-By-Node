import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { MatchesController } from "./matches.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { MatchesValidated } from "./matches.validation";


const router = Router();

//CREATE MATCH ROUTE
router.post("/create",
    checkAuth((UserRole.USER)),
    validateZodSchema(MatchesValidated.createMatchZodSchema),
    MatchesController.createMatch
);

//GET MATCHES FOR SPECIFIC TRAVEL PLAN ROUTE
router.get("/matches-plan/:id",
    checkAuth((UserRole.USER)),
    MatchesController.getMatchesForTravelPlan
);

//MY MATCHES ROUTE
router.get("/my-matches",
    checkAuth(UserRole.USER),
    MatchesController.getMyMatches
);


//SINGLE MATCH ROUTE
router.get("/:id",
    checkAuth((UserRole.USER)),
    MatchesController.getSingleMatch
);

//GET ALL MATCHES ROUTE
router.get("/",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    MatchesController.getAllMatches
);

//UPDATE MATCH ROUTE
router.patch("/:id",
    checkAuth(...Object.values(UserRole)),
    validateZodSchema(MatchesValidated.updateMatchZodSchema),
    MatchesController.updateMatch
);


export const MatchesRouter = router;