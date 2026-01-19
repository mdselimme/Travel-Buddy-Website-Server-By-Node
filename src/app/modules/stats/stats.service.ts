import { IJwtTokenPayload } from "../../types/token.type";
import { ProfileModel } from "../profiles/profile.model";
import { TravelPlanModel } from "../travelPlan/travelPlan.model";
import { UserRole } from "../users/user.interface";
import { UserModel } from "../users/user.model";
import { MatchesModel } from "../matches/matches.model";
import { ReviewModel } from "../review/review.model";
import { PaymentModel } from "../payment/payment.model";
import { TravelPlanStatus } from "../travelPlan/travelPlan.interface";
import { MatchStatus } from "../matches/matches.interface";
import { PaymentStatus } from "../payment/payment.interface";


//get stats data service for admin
const getAdminStats = async () => {
    // Basic counts
    const totalTravelPlans = await TravelPlanModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const totalAdmins = await UserModel.countDocuments({ role: UserRole.ADMIN });
    const totalRegularUsers = await UserModel.countDocuments({ role: UserRole.USER });
    const totalSubscribedUsers = await ProfileModel.countDocuments({ isSubscribed: true });
    const totalMatches = await MatchesModel.countDocuments();
    const totalReviews = await ReviewModel.countDocuments();

    // User growth over last 12 months
    const userGrowth = await UserModel.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: "$_id.year" }, "-",
                        { $toString: "$_id.month" }
                    ]
                },
                count: 1
            }
        }
    ]);

    // Travel plans created over last 12 months
    const travelPlanGrowth = await TravelPlanModel.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: "$_id.year" }, "-",
                        { $toString: "$_id.month" }
                    ]
                },
                count: 1
            }
        }
    ]);

    // Travel plans by status distribution
    const travelPlansByStatus = await TravelPlanModel.aggregate([
        {
            $group: {
                _id: "$travelPlanStatus",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1
            }
        }
    ]);

    // Matches by status distribution
    const matchesByStatus = await MatchesModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1
            }
        }
    ]);

    // Top destinations (cities and countries)
    const topDestinations = await TravelPlanModel.aggregate([
        {
            $group: {
                _id: {
                    city: "$destination.city",
                    country: "$destination.country"
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
            $project: {
                _id: 0,
                city: "$_id.city",
                country: "$_id.country",
                count: 1
            }
        }
    ]);

    // Top travel types
    const topTravelTypes = await TravelPlanModel.aggregate([
        { $unwind: "$travelTypes" },
        {
            $lookup: {
                from: "traveltypes",
                localField: "travelTypes",
                foreignField: "_id",
                as: "travelTypeDetails"
            }
        },
        { $unwind: "$travelTypeDetails" },
        {
            $group: {
                _id: "$travelTypeDetails.name",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
            $project: {
                _id: 0,
                name: "$_id",
                count: 1
            }
        }
    ]);

    // Revenue by subscription plan
    const revenueByPlan = await PaymentModel.aggregate([
        { $match: { status: PaymentStatus.PAID } },
        {
            $group: {
                _id: "$subscriptionType",
                totalRevenue: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                plan: "$_id",
                revenue: "$totalRevenue",
                count: 1
            }
        }
    ]);

    // Revenue growth over last 12 months
    const revenueGrowth = await PaymentModel.aggregate([
        { $match: { status: PaymentStatus.PAID } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                amount: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: "$_id.year" }, "-",
                        { $toString: "$_id.month" }
                    ]
                },
                amount: 1,
                count: 1
            }
        }
    ]);

    // Payment status distribution
    const paymentsByStatus = await PaymentModel.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1,
                totalAmount: 1
            }
        }
    ]);

    // Top rated users
    const topRatedUsers = await ProfileModel.aggregate([
        { $match: { averageRating: { $gt: 0 } } },
        { $sort: { averageRating: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "reviews",
                localField: "user",
                foreignField: "reviewed",
                as: "reviews"
            }
        },
        {
            $project: {
                _id: 0,
                userId: "$user",
                fullName: 1,
                profileImage: 1,
                rating: "$averageRating",
                reviewCount: { $size: "$reviews" }
            }
        }
    ]);

    // Most active users (by travel plans)
    const mostActiveUsers = await TravelPlanModel.aggregate([
        {
            $group: {
                _id: "$user",
                travelPlanCount: { $sum: 1 }
            }
        },
        { $sort: { travelPlanCount: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "profiles",
                localField: "_id",
                foreignField: "user",
                as: "profile"
            }
        },
        { $unwind: "$profile" },
        {
            $project: {
                _id: 0,
                userId: "$_id",
                fullName: "$profile.fullName",
                profileImage: "$profile.profileImage",
                travelPlanCount: 1
            }
        }
    ]);

    // Total revenue
    const totalRevenueData = await PaymentModel.aggregate([
        { $match: { status: PaymentStatus.PAID } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ]);
    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    // Pending payments
    const pendingPaymentsData = await PaymentModel.aggregate([
        { $match: { status: PaymentStatus.PENDING } },
        {
            $group: {
                _id: null,
                totalPending: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        }
    ]);
    const pendingPayments = pendingPaymentsData[0]?.totalPending || 0;
    const pendingPaymentCount = pendingPaymentsData[0]?.count || 0;

    return {
        overview: {
            totalTravelPlans,
            totalUsers,
            totalAdmins,
            totalRegularUsers,
            totalSubscribedUsers,
            totalMatches,
            totalReviews,
            totalRevenue,
            pendingPayments,
            pendingPaymentCount
        },
        userGrowth,
        travelPlanGrowth,
        travelPlansByStatus,
        matchesByStatus,
        topDestinations,
        topTravelTypes,
        revenueByPlan,
        revenueGrowth,
        paymentsByStatus,
        topRatedUsers,
        mostActiveUsers
    };
};

//get stats data service for user
const getUserStats = async (userId: string) => {
    // Basic counts
    const totalTravelPlans = await TravelPlanModel.countDocuments({ user: userId });
    const upcomingTravelPlans = await TravelPlanModel.countDocuments({
        user: userId,
        startDate: { $gt: new Date() }
    });
    const completedTravelPlans = await TravelPlanModel.countDocuments({
        user: userId,
        travelPlanStatus: TravelPlanStatus.COMPLETED
    });
    const cancelledTravelPlans = await TravelPlanModel.countDocuments({
        user: userId,
        travelPlanStatus: TravelPlanStatus.CANCELLED
    });

    // Travel plans by status
    const travelPlansByStatus = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: "$travelPlanStatus",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1
            }
        }
    ]);

    // Travel plans over time (monthly)
    const travelPlansOverTime = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: "$_id.year" }, "-",
                        { $toString: "$_id.month" }
                    ]
                },
                count: 1
            }
        }
    ]);

    // Destinations visited (countries and cities)
    const destinationsVisited = await TravelPlanModel.aggregate([
        { $match: { user: userId, travelPlanStatus: TravelPlanStatus.COMPLETED } },
        {
            $group: {
                _id: {
                    city: "$destination.city",
                    country: "$destination.country"
                }
            }
        },
        {
            $group: {
                _id: null,
                countries: { $addToSet: "$_id.country" },
                cities: { $addToSet: "$_id.city" },
                destinations: {
                    $push: {
                        city: "$_id.city",
                        country: "$_id.country"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalCountries: { $size: "$countries" },
                totalCities: { $size: "$cities" },
                destinations: 1
            }
        }
    ]);

    // Budget analysis
    const budgetAnalysis = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: null,
                totalMinBudget: { $sum: "$budgetRange.min" },
                totalMaxBudget: { $sum: "$budgetRange.max" },
                avgMinBudget: { $avg: "$budgetRange.min" },
                avgMaxBudget: { $avg: "$budgetRange.max" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalBudget: {
                    $divide: [
                        { $add: ["$totalMinBudget", "$totalMaxBudget"] },
                        2
                    ]
                },
                averageBudgetPerTrip: {
                    $divide: [
                        { $add: ["$avgMinBudget", "$avgMaxBudget"] },
                        2
                    ]
                }
            }
        }
    ]);

    // Budget by month
    const budgetByMonth = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: {
                    year: { $year: "$startDate" },
                    month: { $month: "$startDate" }
                },
                amount: {
                    $sum: {
                        $divide: [
                            { $add: ["$budgetRange.min", "$budgetRange.max"] },
                            2
                        ]
                    }
                }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: {
                    $concat: [
                        { $toString: "$_id.year" }, "-",
                        { $toString: "$_id.month" }
                    ]
                },
                amount: { $round: ["$amount", 2] }
            }
        }
    ]);

    // Travel types distribution
    const travelTypeDistribution = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        { $unwind: "$travelTypes" },
        {
            $lookup: {
                from: "traveltypes",
                localField: "travelTypes",
                foreignField: "_id",
                as: "travelTypeDetails"
            }
        },
        { $unwind: "$travelTypeDetails" },
        {
            $group: {
                _id: "$travelTypeDetails.name",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        {
            $project: {
                _id: 0,
                type: "$_id",
                count: 1
            }
        }
    ]);

    // Match statistics
    const matchesSent = await MatchesModel.countDocuments({ senderId: userId });
    const matchesReceived = await MatchesModel.countDocuments({ receiverId: userId });
    const matchesAccepted = await MatchesModel.countDocuments({
        $or: [
            { senderId: userId, status: MatchStatus.ACCEPTED },
            { receiverId: userId, status: MatchStatus.ACCEPTED }
        ]
    });
    const matchesRejected = await MatchesModel.countDocuments({
        $or: [
            { senderId: userId, status: MatchStatus.REJECTED },
            { receiverId: userId, status: MatchStatus.REJECTED }
        ]
    });

    // Review statistics
    const userProfile = await ProfileModel.findOne({ user: userId });
    const totalReviews = await ReviewModel.countDocuments({ reviewed: userId });
    const averageRating = userProfile?.averageRating || 0;

    // Reviews received
    const reviewsReceived = await ReviewModel.aggregate([
        { $match: { reviewed: userId } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                rating: "$_id",
                count: 1
            }
        }
    ]);

    // Upcoming trips timeline
    const upcomingTrips = await TravelPlanModel.find({
        user: userId,
        startDate: { $gte: new Date() }
    })
        .sort({ startDate: 1 })
        .select("travelTitle destination startDate endDate thumbnail travelPlanStatus")
        .limit(10)
        .lean();

    // Trip duration distribution
    const tripDurationDistribution = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        {
            $project: {
                duration: {
                    $divide: [
                        { $subtract: ["$endDate", "$startDate"] },
                        1000 * 60 * 60 * 24
                    ]
                }
            }
        },
        {
            $bucket: {
                groupBy: "$duration",
                boundaries: [0, 3, 7, 14, 30, 60, 1000],
                default: "60+",
                output: {
                    count: { $sum: 1 }
                }
            }
        },
        {
            $project: {
                _id: 0,
                range: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$_id", 0] }, then: "1-2 days" },
                            { case: { $eq: ["$_id", 3] }, then: "3-6 days" },
                            { case: { $eq: ["$_id", 7] }, then: "1-2 weeks" },
                            { case: { $eq: ["$_id", 14] }, then: "2-4 weeks" },
                            { case: { $eq: ["$_id", 30] }, then: "1-2 months" },
                            { case: { $eq: ["$_id", 60] }, then: "2+ months" }
                        ],
                        default: "60+ days"
                    }
                },
                count: 1
            }
        }
    ]);

    // Travel frequency by month
    const travelFrequencyByMonth = await TravelPlanModel.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: { $month: "$startDate" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                month: "$_id",
                count: 1
            }
        }
    ]);

    return {
        overview: {
            totalTravelPlans,
            upcomingTravelPlans,
            completedTravelPlans,
            cancelledTravelPlans,
            totalCountries: destinationsVisited[0]?.totalCountries || 0,
            totalCities: destinationsVisited[0]?.totalCities || 0
        },
        travelPlansByStatus,
        travelPlansOverTime,
        destinationsVisited: destinationsVisited[0]?.destinations || [],
        budgetAnalysis: budgetAnalysis[0] || { totalBudget: 0, averageBudgetPerTrip: 0 },
        budgetByMonth,
        travelTypeDistribution,
        socialMetrics: {
            matchesSent,
            matchesReceived,
            matchesAccepted,
            matchesRejected,
            acceptanceRate: matchesSent > 0 ? ((matchesAccepted / matchesSent) * 100).toFixed(2) : 0,
            averageRating,
            totalReviews
        },
        reviewsReceived,
        upcomingTrips,
        tripDurationDistribution,
        travelFrequencyByMonth
    };
};

//get stats data service
const getStatsData = async (decodedToken: IJwtTokenPayload) => {
    if (decodedToken.role === UserRole.ADMIN || decodedToken.role === UserRole.SUPER_ADMIN) {
        return await getAdminStats();
    }

    if (decodedToken.role === UserRole.USER) {
        return await getUserStats(decodedToken.userId);
    }
};

export const StatsService = { getStatsData };