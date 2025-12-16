import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { MatchesController } from "./matches.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { MatchesValidated } from "./matches.validation";


const router = Router();

//CREATE MATCH ROUTE
router.post("/create",
    checkAuth(...Object.values(UserRole)),
    validateZodSchema(MatchesValidated.createMatchZodSchema),
    MatchesController.createMatch
);

//MY MATCHES ROUTE
router.get("/my-matches",
    checkAuth(...Object.values(UserRole)),
    MatchesController.getMyMatches
);


//SINGLE MATCH ROUTE
router.get("/:id",
    checkAuth(...Object.values(UserRole)),
    MatchesController.getSingleMatch
);

//GET ALL MATCHES ROUTE
router.get("/",
    checkAuth(...Object.values(UserRole)),
    MatchesController.getAllMatches
);

//UPDATE MATCH ROUTE
router.patch("/:id",
    checkAuth(...Object.values(UserRole)),
    validateZodSchema(MatchesValidated.updateMatchZodSchema),
    MatchesController.updateMatch
);


export const MatchesRouter = router;