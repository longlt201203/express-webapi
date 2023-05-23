import { NextFunction, Response } from "express";
import { Request } from "../core/api-controller";
import { Logger } from "../core/logger";

export default class DemoMiddleware {
    private static logger = new Logger("DemoMiddleware");

    static sayHi() {
        return async (req: Request, res: Response, next: NextFunction) => {
            this.logger.info("Hi");
            return next();
        }
    }

    static saySomeThing(something: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            // Put something to req.custom
            req.custom.test = "Hello";
            this.logger.info(something);
            return next();
        }
    }
}