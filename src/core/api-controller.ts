import Express, { NextFunction, Response, Router } from "express";
import { Logger } from "./logger";

export enum HttpMethod {
	GET = "get",
	POST = "post",
	PUT = "put",
	DELETE = "delete",
}

export enum HttpStatusCode {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
}

/**
 * Request with body, query and params
 */
export type Request = Omit<Express.Request, "body" | "query" | "params"> & {
	body: any;
	query: any;
	params: any;
	custom?: any;
};

export const RequestInitializer: RequestHandler = async (req, res, next) => {
	req.custom = {};
	return next();
}

export type RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any> | any;

/**
 * Base class for API controllers
 */
export default class ApiController {
	private readonly router: Router;
	private readonly handlers: Array<string> = [];

	get Path(): string {
		return this.path;
	}

	get Router(): Router {
		return this.router;
	}

	get Handlers(): Array<string> {
		return this.handlers;
	}

	constructor(private readonly path: string) {
		this.router = Router();
	}

	protected addHandler(
		method: HttpMethod,
		alias: string,
		handler: RequestHandler,
		...middlewares: RequestHandler[]
	): void {
		this.handlers.push(`${method.toUpperCase()} ${this.path}${alias}`);
		this.router[method](
			alias,
			...middlewares,
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					await handler(req, res, next);
					new Logger(`${req.method} ${req.originalUrl}`).info(
						`Request handled successfully with status ${res.statusCode}`
					);
				} catch (err) {
					next(err);
				}
			}
		);
	}
}
