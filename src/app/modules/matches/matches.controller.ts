import httpStatus from 'http-status-codes';
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync"
import ApiResponse from "../../utils/ApiResponse";
import { MatchesService } from './matches.service';


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

export const MatchesController = {
    createMatch,
    getAllMatches
};