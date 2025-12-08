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

//GET ALL MATCHES ROUTE
router.get("/",
    checkAuth(...Object.values(UserRole)),
    MatchesController.getAllMatches
);


export const MatchesRouter = router;