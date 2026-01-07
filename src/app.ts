/* eslint-disable no-console */
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundRoute from './app/middlewares/notFoundRoute';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandlers';
import cron from 'node-cron';
import { SubscriptionService } from './app/modules/subscription/subscription.service';
import { envVars } from './config/envVariable.config';
import { TravelPlanService } from './app/modules/travelPlan/travelPlan.service';


const app: Application = express();

// Middleware
app.use(cors({
    origin: [envVars.CLIENT_SITE_URL, 'http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Schedule a cron job to run every hour
cron.schedule("0 * * * *", async () => {
    try {
        await SubscriptionService.checkAndUpdateExpiredSubscriptionsService();
        await TravelPlanService.autoCancelTravelPlans();
        console.log("node cron called at: " + new Date())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error.message)
    }
});

// default router after server is running
app.get('/', (req: Request, res: Response) => {
    res.send({
        version: '1.0.6',
        message: 'Welcome to the Travel Buddy Server is Running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime().toFixed(2) + ' seconds'
    });
});

// initialize all router 
app.use('/api/v1', router);

// Global error handler middleware
app.use(globalErrorHandler);

// add not found route middleware
app.use(notFoundRoute);

export default app;