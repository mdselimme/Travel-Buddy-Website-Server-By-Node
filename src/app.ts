import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFoundRoute from './app/middlewares/notFoundRoute';
import router from './app/routes';
const app: Application = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// default router after server is running
app.get('/', (req: Request, res: Response) => {
    res.send({
        version: '1.0.0',
        message: 'Welcome to the Travel Buddy Server is Running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime().toFixed(2) + ' seconds'
    });
});

// initialize all router 
app.use('/api/v1', router);

// add not found route middleware
app.use(notFoundRoute);

export default app;