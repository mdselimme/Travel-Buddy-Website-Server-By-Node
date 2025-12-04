import httpStatus from 'http-status-codes';
import ApiResponse from "../../utils/ApiResponse";
import catchAsync from "../../utils/catchAsync";
import { BookingService } from './booking.service';




//CREATE A BOOKING
const createABooking = catchAsync(async (req, res) => {

    const result = await BookingService.createABooking(req.body);

    ApiResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking created successfully",
        data: result
    })

});






export const BookingController = {
    createABooking
};