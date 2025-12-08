import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { TravelPlanRouter } from "../modules/travelPlan/travelPlan.route";
import { ReviewRouter } from "../modules/review/review.route";
import { SubscriptionRouter } from "../modules/subscription/subscription.route";
import { PaymentRouter } from "../modules/payment/payment.route";
import { TravelTypeRouter } from "../modules/travelType/travelType.route";
import { ProfileRouter } from "../modules/profiles/profile.route";

interface IRoute {
    path: string;
    route: Router;
}

const router = Router();

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
        path: "/review",
        route: ReviewRouter
    }
];

allRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});
export default router;