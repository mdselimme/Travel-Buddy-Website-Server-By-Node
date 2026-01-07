import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync"
import ApiResponse from "../../utils/ApiResponse";
import { MatchesService } from './matches.service';
import { IJwtTokenPayload } from '../../types/token.type';


//CREATE MATCH CONTROLLER
const createMatch = catchAsync(async (req: Request, res: Response) => {

    const result = await MatchesService.createMatch(req.body);

    ApiResponse(res, {
        success: true,
        message: "Match created successfully",
        statusCode: httpStatus.CREATED,
        data: result
    });

});

//GET ALL MATCHES CONTROLLER
const getAllMatches = catchAsync(async (req: Request, res: Response) => {

    const result = await MatchesService.getAllMatches(req.query);

    ApiResponse(res, {
        success: true,
        message: "All matches fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    });
});

//UPDATE MATCH CONTROLLER
const updateMatch = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const matchId = req.params.id;

    const result = await MatchesService.updateMatch(decodedToken as IJwtTokenPayload, matchId, req.body);

    ApiResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Update match status successfully.",
        data: result
    });
});

//SINGLE MATCH CONTROLLER
const getSingleMatch = catchAsync(async (req: Request, res: Response) => {
    const matchId = req.params.id;

    const result = await MatchesService.getSingleMatch(matchId);
    ApiResponse(res, {
        success: true,
        message: "Match fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    });
});

//MY MATCHES CONTROLLER
const getMyMatches = catchAsync(async (req: Request, res: Response) => {

    const decodedToken = req.user;

    const result = await MatchesService.getMyMatches(decodedToken as IJwtTokenPayload);

    ApiResponse(res, {
        success: true,
        message: "My matches fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    });
});

//GET MATCHES FOR SPECIFIC TRAVEL PLAN CONTROLLER
const getMatchesForTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const travelPlanId = req.params.id;
    const result = await MatchesService.getMatchesForTravelPlan(travelPlanId);
    ApiResponse(res, {
        success: true,
        message: "Matches for travel plan fetched successfully",
        statusCode: httpStatus.OK,
        data: result
    });
});

export const MatchesController = {
    createMatch,
    getAllMatches,
    updateMatch,
    getSingleMatch,
    getMyMatches,
    getMatchesForTravelPlan
};