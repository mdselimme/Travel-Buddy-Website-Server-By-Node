import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { TravelPlanRouter } from "../modules/travelPlan/travelPlan.route";
import { ReviewRouter } from "../modules/review/review.route";
import { SubscriptionRouter } from "../modules/subscription/subscription.route";
import { PaymentRouter } from "../modules/payment/payment.route";
import { TravelTypeRouter } from "../modules/travelType/travelType.route";
import { ProfileRouter } from "../modules/profiles/profile.route";
import { MatchesRouter } from "../modules/matches/matches.route";
import { StatsRouter } from "../modules/stats/stats.route";
import { apiLimiter } from "../middlewares/rateLimiter";

interface IRoute {
    path: string;
    route: Router;
}

const router = Router();

// Apply API rate limiter to all routes
router.use(apiLimiter);

const allRoutes: IRoute[] = [
    {
        path: "/user",
        route: UserRouter
    },
    {
        path: "/auth",
        route: AuthRouter
    },
    {
        path: "/profile",
        route: ProfileRouter
    },
    {
        path: "/travel-plan",
        route: TravelPlanRouter
    },
    {
        path: "/subscription",
        route: SubscriptionRouter
    },
    {
        path: "/payment",
        route: PaymentRouter
    },
    {
        path: "/travel-type",
        route: TravelTypeRouter
    },
    {
        path: "/matches",
        route: MatchesRouter
    },
    {
        path: "/review",
        route: ReviewRouter
    },
    {
        path: "/stats",
        route: StatsRouter
    }
];

allRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});
export default router;