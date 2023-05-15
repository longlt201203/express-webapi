import Express, { NextFunction, Response, Router } from "express";
import { Logger } from "./logger";

export enum HttpMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

/**
 * Request with body, query and params
 */
export type Request = Omit<Express.Request, "body" | "query" | "params"> & {
    body: any,
    query: any,
    params: any
};

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;

/**
 * Base class for API controllers
 */
export default class ApiController {
    private readonly router: Router;

    get Path(): string {
        return this.path;
    }

    get Router(): Router {
        return this.router;
    }

    constructor(
        private readonly path: string
    ) {
        SwaggerDocs.tags.push({ name: this.path });
        this.router = Router();
    }

    protected addHandler(method: HttpMethod, alias: string, handler: RequestHandler, ...middlewares: RequestHandler[]): void {
        /* Swagger is coming soon

        SwaggerDocs.paths[`${this.path}${alias}`] = {
            [method] : {
                tags: [this.path],
                responses: {
                    default: {
                        description: "Default response"
                    }
                }
            }
        };

        */
        this.router[method](alias, ...middlewares, async (req: Request, res: Response, next: NextFunction) => {
            try {
                await handler(req, res, next);
                new Logger(`${req.method} ${req.originalUrl}`).info(`Request handled successfully with status ${res.statusCode}`);
            } catch (err) {
                next(err);
            }
        });
    }
}