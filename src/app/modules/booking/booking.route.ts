import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../users/user.interface";
import { BookingController } from "./booking.controller";



const router = Router();

//CREATE A NEW BOOKING
router.post("/create-booking",
    checkAuth(...Object.values(UserRole)),
    BookingController.createABooking
);

export const BookingRouter = router;