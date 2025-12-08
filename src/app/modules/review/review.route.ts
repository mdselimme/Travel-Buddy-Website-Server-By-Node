import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { ReviewController } from "./review.controller";



const router = Router();

//CREATE A REVIEW
router.post("/create",
    checkAuth(...Object.values(UserRole)),
    ReviewController.createReview);

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