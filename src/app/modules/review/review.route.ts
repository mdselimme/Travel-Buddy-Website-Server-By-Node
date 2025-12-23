import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { ReviewController } from "./review.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { ReviewValidated } from "./review.validation";



const router = Router();

//CREATE A REVIEW
router.post("/create",
    checkAuth(...Object.values(UserRole)),
    validateZodSchema(ReviewValidated.createReviewZodSchema),
    ReviewController.createReview);

//GET MY REVIEWS
router.get("/my-reviews",
    checkAuth(...Object.values(UserRole)),
    ReviewController.getMyReviews
);

//Travel Plan Reviews
router.get("/travel-plan/:id",
    checkAuth(...Object.values(UserRole)),
    ReviewController.getTravelPlanReviews
);

//GET A SINGLE REVIEW
router.get("/:id",
    checkAuth(...Object.values(UserRole)),
    ReviewController.getSingleReview);

//GET ALL REVIEWS
router.get("/",
    checkAuth(...Object.values(UserRole)),
    ReviewController.getAllReviews);

//UPDATE A REVIEW
router.patch("/:id",
    checkAuth(...Object.values(UserRole)),
    ReviewController.updateReview);



//DELETE A REVIEW
router.delete("/:id",
    checkAuth(...Object.values(UserRole)),
    ReviewController.deleteReview);

export const ReviewRouter = router;