import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { ReviewController } from "./review.controller";
import validateZodSchema from "../../middlewares/validateZodSchemaRequest";
import { ReviewValidated } from "./review.validation";



const router = Router();

//CREATE A REVIEW
router.post("/create",
    checkAuth(UserRole.USER),
    validateZodSchema(ReviewValidated.createReviewZodSchema),
    ReviewController.createReview);

//GET MY REVIEWS
router.get("/my-reviews",
    checkAuth(UserRole.USER),
    ReviewController.getMyReviews
);

//Travel Plan Reviews
router.get("/travel-plan/:id",
    checkAuth(UserRole.USER),
    ReviewController.getTravelPlanReviews
);

//GET A SINGLE REVIEW
router.get("/:id",
    checkAuth(UserRole.USER),
    ReviewController.getSingleReview);

//GET ALL REVIEWS
router.get("/",
    ReviewController.getAllReviews);

//UPDATE A REVIEW
router.patch("/:id",
    checkAuth(UserRole.USER),
    ReviewController.updateReview);

//DELETE A REVIEW
router.delete("/:id",
    checkAuth(UserRole.USER),
    ReviewController.deleteReview);

export const ReviewRouter = router;