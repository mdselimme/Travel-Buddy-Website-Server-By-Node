import { model, Schema } from "mongoose";
import { BookingStatus, IBooking } from "./booking.interface";


const bookingSchema = new Schema<IBooking>({
    travelersId: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    paymentsId: [{ type: Schema.Types.ObjectId, ref: 'Payment', required: true }],
    travelPlanId: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
}, {
    timestamps: true,
    versionKey: false
});

export const BookingModel = model<IBooking>('Booking', bookingSchema);