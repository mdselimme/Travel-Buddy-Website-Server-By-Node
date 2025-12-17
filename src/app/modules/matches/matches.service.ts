/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IMatch } from "./matches.interface";
import { MatchesModel } from "./matches.model";
import { createQuery } from '../../utils/querySearch';
import { IJwtTokenPayload } from '../../types/token.type';
import { TravelPlanModel } from '../travelPlan/travelPlan.model';

const createMatch = async (matchData: IMatch) => {

    if (matchData.senderId === matchData.receiverId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You cannot match with yourself.");
    }

    const travelPlan = await TravelPlanModel.findById(matchData.travelPlanId);

    if (!travelPlan) {
        throw new ApiError(httpStatus.NOT_FOUND, "Travel Plan not found.");
    }

    const checkMatch = await MatchesModel.findOne({
        travelPlanId: matchData.travelPlanId,
        receiverId: matchData.receiverId,
        senderId: matchData.senderId,
    });

    if (checkMatch) {
        throw new ApiError(httpStatus.CONFLICT, "Match already exists between these users for this travel plan");
    };

    const newMatch = await MatchesModel.create(matchData);

    return newMatch;
};

//Update MATCH SERVICE FUNCTION
const updateMatch = async (decodedToken: IJwtTokenPayload, id: string, matchData: Partial<IMatch> & { matchId: string }) => {
    const travelPlan = await TravelPlanModel.findOne({ user: decodedToken.userId });
    if (!travelPlan) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized to update this match.");
    }
    const match = await MatchesModel.findById(id);
    if (!match) {
        throw new ApiError(httpStatus.NOT_FOUND, "Match not found.");
    }
    if (match.status === matchData.status) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Already have your given status.`);
    }
    const updatedMatch = await MatchesModel.findByIdAndUpdate(
        id,
        matchData,
        { new: true, runValidators: true }
    );
    if (!updatedMatch) {
        throw new ApiError(httpStatus.NOT_FOUND, "Match not found.");
    }
    return updatedMatch;
};

//GET ALL MATCHES SERVICE FUNCTION
const getAllMatches = async (query: any) => {

    const { search, limit, page, sort } = query;

    const matches = await createQuery(MatchesModel)
        .search(["status"],
            search as string
        )
        .paginate(page || 1, limit || 10)
        .populateDeep([
            {
                path: "receiverId",
                select: "email profile",
                populate: {
                    path: "profile",
                    select: "fullName contactNumber profileImage"
                }
            },
            {
                path: "senderId",
                select: "email profile",
                populate: {
                    path: "profile",
                    select: "fullName contactNumber profileImage"
                }
            }
        ])
        .sort(sort || "-createdAt")
        .exec();


    return matches;
};


//SINGLE MATCH SERVICE FUNCTION
const getSingleMatch = async (matchId: string) => {
    const match = await MatchesModel.findById(matchId)
        .populate("travelPlanId", "destination startDate endDate")
        .populate("senderId", "email")
        .populate("receiverId", "email");

    if (!match) {
        throw new ApiError(httpStatus.NOT_FOUND, "Match not found.");
    }

    return match;
};

//MY MATCHES SERVICE FUNCTION
const getMyMatches = async (decodedToken: IJwtTokenPayload) => {

    const myMatches = await MatchesModel.find({
        $or: [
            { senderId: decodedToken.userId },
            { receiverId: decodedToken.userId }
        ]
    })
        .populate("travelPlanId", "travelTitle travelPlanStatus user")

    return myMatches;
};


export const MatchesService = {
    createMatch,
    getAllMatches,
    updateMatch,
    getMyMatches,
    getSingleMatch
};