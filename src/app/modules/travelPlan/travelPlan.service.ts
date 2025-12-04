import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ITravelPlan } from "./travelPlan.interface"
import { TravelPlanModel } from "./travelPlan.model";


//CREATE A TRAVEL PLAN SERVICE
const createATravelPlan = async (payload: Partial<ITravelPlan>): Promise<Partial<ITravelPlan>> => {

    if (!payload.thumbnail) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Thumbnail is required");
    }

    const travelPlan = await TravelPlanModel.create(payload);
    return travelPlan;
}


export const TravelPlanService = {
    createATravelPlan
}