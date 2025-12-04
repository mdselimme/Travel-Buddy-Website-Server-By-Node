import { model, Schema } from "mongoose";
import { BookingStatus, IBooking } from "./booking.interface";


const bookingSchema = new Schema<IBooking>({
    travelerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    travelPlanId: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    totalMembers: { type: Number, required: true },
    totalCosts: { type: Number, required: true },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.ONGOING },
}, {
    timestamps: true,
    versionKey: false
});

export const BookingModel = model<IBooking>('Booking', bookingSchema);