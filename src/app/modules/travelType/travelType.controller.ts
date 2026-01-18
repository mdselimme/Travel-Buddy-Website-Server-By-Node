import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import { TravelTypeService } from "./travelType.service";
import ApiResponse from "../../utils/ApiResponse";


//CREATE TRAVEL TYPE CONTROLLER
const createTravelTypeController = async (req: Request, res: Response) => {

    const result = await TravelTypeService.createTravelTypeService(req.body);

    ApiResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Travel type created successfully',
        data: result
    });
};

//UPDATE TRAVEL TYPE CONTROLLER
const updateTravelTypeController = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await TravelTypeService.updateTravelTypeService(id, req.body);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Travel type updated successfully',
        data: result
    });
};

//GET ALL TRAVEL TYPES CONTROLLER
const getAllTravelTypesController = async (req: Request, res: Response) => {
    const result = await TravelTypeService.getAllTravelTypesService(req.query);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Travel types retrieved successfully',
        data: result
    });
};

//GET ALL TRAVEL TYPES CONTROLLER
const getAllTravelTypesForUsersController = async (req: Request, res: Response) => {
    const result = await TravelTypeService.getAllTravelTypesServiceForUsers();
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users Travel types retrieved successfully',
        data: result
    });
};

//GET SINGLE TRAVEL TYPE CONTROLLER
const getSingleTravelTypeController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TravelTypeService.getSingleTravelTypeService(id);

    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Travel type retrieved successfully',
        data: result
    });
};

//DELETE TRAVEL TYPE CONTROLLER
const deleteTravelTypeController = async (req: Request, res: Response) => {
    const { id } = req.params;
    await TravelTypeService.deleteTravelTypeService(id);
    ApiResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Travel type deleted successfully',
        data: null
    });
};

export const TravelTypeController = {
    createTravelTypeController,
    updateTravelTypeController,
    getAllTravelTypesController,
    getSingleTravelTypeController,
    deleteTravelTypeController,
    getAllTravelTypesForUsersController
};