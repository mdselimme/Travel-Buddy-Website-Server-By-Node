/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/envVariable.config";
import { IErrorSource } from "../types/error.types";
import { handleZodError } from "../errorHelpers/handleZodError";


//GLOBAL ERROR HANDLER MIDDLEWARE
export const globalErrorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === 'development') {
        console.error("Error Details:", error);
    };

    let errorSources: IErrorSource[] = [];
    let statusCode = 500;
    let message = `Something went wrong on the server. Please try again later!! ${error.message || ''}`;

    //Zod Validation Error
    if (error.name === 'ZodError') {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? error : null,
        stack: envVars.NODE_ENV === 'development' ? error.stack : null,
    });

}