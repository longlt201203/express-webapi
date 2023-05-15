import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Response } from "express";
import { HttpStatusCode, Request } from "../core/api-controller";
import { Logger } from "./logger";

export default class DtoMapper {
    static fromBody<T extends object>(classConstructor: ClassConstructor<T>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.body) {
                const data = plainToClass(classConstructor, req.body, {
                    enableImplicitConversion: true, 
                });
                const errors = await validate(data);
                if (errors.length > 0) {
                    // new Logger(`${req.method} ${req.originalUrl}`).warn(`Validation error: ${JSON.stringify(errors, null, 2)}`);
                    new Logger(`${req.method} ${req.originalUrl}`).warn(`Validation error!`);
                    return res.status(HttpStatusCode.BAD_REQUEST).send({
                        message: "Validation error!",
                        errors: errors
                    });
                }
                req.body = data;
            }
            return next();
        }
    }

    static fromQuery<T extends object>(classConstructor: ClassConstructor<T>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.query) {
                const data = plainToClass(classConstructor, req.query, {
                    enableImplicitConversion: true, 
                });
                const errors = await validate(data);
                if (errors.length > 0) {
                    // new Logger(`${req.method} ${req.originalUrl}`).warn(`Validation error: ${JSON.stringify(errors, null, 2)}`);
                    new Logger(`${req.method} ${req.originalUrl}`).warn(`Validation error!`);
                    return res.status(HttpStatusCode.BAD_REQUEST).send({
                        message: "Validation error!",
                        errors: errors
                    });
                }
                req.query = data;
            }
            return next();
        }
    }

    static fromParams<T extends object>(classConstructor: ClassConstructor<T>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.params) {
                const data = plainToClass(classConstructor, req.params, {
                    enableImplicitConversion: true, 
                });
                const errors = await validate(data);
                if (errors.length > 0) {
                    // new Logger(`${req.method} ${req.originalUrl}`).warn(`Validation error: ${JSON.stringify(errors, null, 2)}`);
                    new Logger(`${req.method} ${req.originalUrl}`).warn(`Validation error!`);
                    return res.status(HttpStatusCode.BAD_REQUEST).send({
                        message: "Validation error!",
                        errors: errors
                    });
                }
                req.params = data;
            }
            return next();
        }
    }
}