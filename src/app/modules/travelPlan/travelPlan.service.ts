/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ITravelPlan } from "./travelPlan.interface"
import { TravelPlanModel } from "./travelPlan.model";
import { createQuery } from '../../utils/querySearch';
import { deleteImageFromCloudinary } from '../../../config/cloudinary.config';
import { TravelTypeModel } from "../travelType/travelType.model";


//CREATE A TRAVEL PLAN SERVICE
const createATravelPlan = async (payload: Partial<ITravelPlan>): Promise<Partial<ITravelPlan>> => {

    const travelPlan = await TravelPlanModel.create(payload);
    return travelPlan;
}

//UPDATE A TRAVEL PLAN SERVICE
const updateATravelPlan = async (id: string, payload: Partial<ITravelPlan>): Promise<Partial<ITravelPlan> | null> => {

    const existingTravelPlan = await TravelPlanModel.findById(id);

    if (!existingTravelPlan) {
        throw new ApiError(httpStatus.NOT_FOUND, "Travel Plan not found");
    }

    if (payload.thumbnail && existingTravelPlan.thumbnail) {
        await deleteImageFromCloudinary(existingTravelPlan.thumbnail);
    }

    const updatedTravelPlan = await TravelPlanModel.findByIdAndUpdate(id, payload, { new: true });
    return updatedTravelPlan;
};

//GET ALL TRAVEL PLANS SERVICE
const getAllTravelPlans = async (query: any) => {

    const {
        page,
        limit,
        sort,
        search,
        destination,
        travelType,
        startDate,
        endDate,
        status,
        fields
    } = query;

    // Build filter object
    const filters: any = {};

    if (destination) {
        filters.destination = destination;
    }

    // Handle travelType by typeName
    if (travelType) {

        const travelTypeDoc = await TravelTypeModel.findOne({ typeName: new RegExp(travelType, 'i') });
        if (travelTypeDoc) {
            filters.travelTypes = travelTypeDoc._id;
        }

    }

    if (status) {
        filters.status = status;
    }

    const result = await createQuery(TravelPlanModel)
        .filter(filters)
        .search(['travelTitle', 'destination.city', 'destination.country'], search)
        .dateRange('startDate', startDate, endDate)
        .populate('travelTypes', 'typeName')
        .populate('user', 'name email')
        .sort(sort || '-createdAt')
        .select(fields)
        .paginate(Number(page) || 1, Number(limit) || 10)
        .exec();

    return result;

};

//GET MY TRAVEL PLANS SERVICE
const getMyTravelPlans = async (userId: string): Promise<Partial<ITravelPlan>[]> => {
    const myTravelPlans = await TravelPlanModel.find({ user: userId }).sort({ createdAt: -1 }).populate('travelTypes', "typeName");
    return myTravelPlans;
}

//GET SINGLE TRAVEL PLAN SERVICE
const getSingleTravelPlan = async (id: string): Promise<Partial<ITravelPlan> | null> => {
    const travelPlan = await TravelPlanModel.findById(id).populate('travelTypes', "typeName");

    if (!travelPlan) {
        throw new ApiError(httpStatus.NOT_FOUND, "Travel Plan not found");
    }

    return travelPlan;
};

//DELETE A TRAVEL PLAN SERVICE
const deleteATravelPlan = async (id: string): Promise<Partial<ITravelPlan> | null> => {
    const existingTravelPlan = await TravelPlanModel.findById(id);

    if (!existingTravelPlan) {
        throw new ApiError(httpStatus.NOT_FOUND, "Travel Plan not found");
    }

    if (existingTravelPlan?.thumbnail) {
        await deleteImageFromCloudinary(existingTravelPlan.thumbnail);
    }

    await TravelPlanModel.findByIdAndDelete(id);

    return null

};

export const TravelPlanService = {
    createATravelPlan,
    updateATravelPlan,
    getAllTravelPlans,
    getSingleTravelPlan,
    deleteATravelPlan,
    getMyTravelPlans
}