/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { ITravelType } from "./travelType.interface";
import { TravelTypeModel } from "./travelType.model";
import { createQuery } from '../../utils/querySearch';


//CREATE TRAVEL TYPE SERVICE
const createTravelTypeService = async (travelTypeData: Partial<ITravelType>) => {

    const travelTypeExists = await TravelTypeModel.findOne({ typeName: travelTypeData.typeName });

    if (travelTypeExists) {
        throw new ApiError(httpStatus.CONFLICT, 'Travel type already exists');
    }

    const newTravelType = await TravelTypeModel.create(travelTypeData);

    return newTravelType;
};

//Update TRAVEL TYPE SERVICE
const updateTravelTypeService = async (id: string, travelTypeData: Partial<ITravelType>) => {
    const travelType = await TravelTypeModel.findById(id);

    if (!travelType) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel type not found');
    }

    if (travelTypeData.typeName === travelType.typeName) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide a different type name to update because it is the same as the current one');
    }

    const updatedTravelType = await TravelTypeModel.findByIdAndUpdate(id, travelTypeData, { new: true });

    return updatedTravelType;
};

//GET ALL TRAVEL TYPES SERVICE
const getAllTravelTypesService = async (query: any) => {

    const { sort, limit, page } = query;

    const travelTypes = await createQuery(TravelTypeModel)
        .sort(sort || '-createdAt')
        .paginate(page || 1, limit || 10)
        .select("typeName")
        .exec();
    return travelTypes;
};

//GET ALL TRAVEL TYPES SERVICE
const getAllTravelTypesServiceForUsers = async () => {

    const travelTypes = await TravelTypeModel.find().select("typeName").exec();
    return travelTypes;
};

//GET SINGLE TRAVEL TYPE SERVICE
const getSingleTravelTypeService = async (id: string): Promise<ITravelType | null> => {
    const travelType = await TravelTypeModel.findById(id);
    if (!travelType) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel type not found');
    }
    return travelType;
};

//DELETE TRAVEL TYPE SERVICE
const deleteTravelTypeService = async (id: string): Promise<ITravelType | null> => {
    const travelType = await TravelTypeModel.findById(id);
    if (!travelType) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel type not found');
    }
    const deletedTravelType = await TravelTypeModel.findByIdAndDelete(id);
    return deletedTravelType;
};

export const TravelTypeService = {
    createTravelTypeService,
    updateTravelTypeService,
    getAllTravelTypesService,
    getSingleTravelTypeService,
    deleteTravelTypeService,
    getAllTravelTypesServiceForUsers
};

