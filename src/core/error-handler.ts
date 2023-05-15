import { NextFunction, Response } from "express";
import { HttpStatusCode, Request } from "../core/api-controller";
import { Logger } from "./logger";

/**
 * Error handler
 * Edit this function to customize error handling
 * @param err - Error
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 * @returns 
 */
export function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    new Logger(`${req.method} ${req.originalUrl}`).error(`Internal server error with message: ${err.message}\nError object:\n${JSON.stringify(err, null, 2)}`);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: "Internal server error",
        error: err
    });
}

/**
 * Not found handler
 * Edit this function to customize not found handling
 * @param err - Error
 * @param req - Request
 * @param res - Response
 * @param next - NextFunction
 * @returns 
 */
export function NotFoundHandler(req: Request, res: Response, next: NextFunction) {
    new Logger(`${req.method} ${req.originalUrl}`).warn(`Not found`);
    return res.status(HttpStatusCode.NOT_FOUND).send({
        message: "Not found",
    });
}