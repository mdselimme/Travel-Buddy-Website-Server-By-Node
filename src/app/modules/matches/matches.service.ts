/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import ApiError from "../../utils/ApiError";
import { IMatch } from "./matches.interface";
import { MatchesModel } from "./matches.model";
import { createQuery } from '../../utils/querySearch';

const createMatch = async (matchData: IMatch) => {

    const checkMatch = await MatchesModel.findOne({
        travelPlanId: matchData.travelPlanId,
        senderId: matchData.senderId,
    });

    if (checkMatch) {
        throw new ApiError(httpStatus.CONFLICT, "Match already exists between these users for this travel plan");
    };

    const newMatch = await MatchesModel.create(matchData);

    return newMatch;
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

export const MatchesService = {
    createMatch,
    getAllMatches
};