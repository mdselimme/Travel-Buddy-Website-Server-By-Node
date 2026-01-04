import rateLimit from "express-rate-limit";
import { envVars } from "../../config/envVariable.config";

export const apiLimiter = rateLimit({
    windowMs: Number(envVars.RATE_LIMITER.RATE_LIMITER_WINDOW_MS), // 15 minutes
    max: Number(envVars.RATE_LIMITER.RATE_LIMITER_API_MAX_REQUEST), // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: Number(envVars.RATE_LIMITER.RATE_LIMITER_WINDOW_MS),
    max: Number(envVars.RATE_LIMITER.RATE_LIMITER_AUTH_MAX_REQUEST),
    message: "Too many login attempts, please try again later.",
    skipSuccessfulRequests: true,
});