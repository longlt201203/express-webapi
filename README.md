# express-webapi
## Description
This is an initial source for Web API using Typescript.

To run the project, use the following commands:
```shell
# Dev
npm run dev

# Build
npm run build

# Start
npm start
```
## Structure
This project has the following structure:
![Project strucure](./docs/images/express-webapi-diagram.drawio.png)
Implement the organization as below:
```
src
  |
  core
  controllers
  database
    |
    migrations
    models
  main.ts
.env
```
## Core
The `core` folder contains the following files:
- `api-controller.ts` - provides the base for controller
- `dto-mapper.ts` - provides DTO mapping functions
- `error-handler.ts` - provides error handling
- `globals.ts` - defines environtment/global variables
- `logger.ts` - defines the Logger class
- `swagger-docs.ts` - provides default config for Swagger
- `upload.ts` - file upload with Multer
- `web-api.ts` - provides the app base

In addition, there is the file `main.ts` outside `core` folder and inside `src` folder. This file contains `Main` class which is exported with some useful static properties:
- `Application` - the application itself
- `DataSource` - database access
- `Logger` - global logger
## Global Variables
You can put all your environment and global variables into `globals.ts` within the `core` folder. 
## Controller
The `controllers` folder contains all of your controller. Each controller has its own request handlers. To define a controller, create a sub-folder inside the `controllers` folder and create a new controller file. For example:
```
# Define Authentication Controller

controllers
  |
  auth
    |
    auth.controller.ts
```
Content of the file:
```typescript
import { NextFunction, Response } from "express";
import ApiController, { Request, HttpMethod } from "../../core/api-controller";

export default class UserController extends ApiController {
    constructor() {
        super("/auth");

        this.addHandler(HttpMethod.GET, "/", this.test());
    }

    private test(req: Request, res: Response, next: NextFunction) {
        return async (req: Request, res: Response) => {
           return res.status(HttpStatusCode.OK).send("Test Auth");
        }
    }
}
```
Note that `Request` is imported from `core/api-controller.ts`.

You can use `DtoMapper`, which is built from [`class-validator`](https://www.npmjs.com/package/class-validator) and [`class-transformer`](https://www.npmjs.com/package/class-transformer), to validate and convert your request body, query or params to your desired type. Example:
```typescript
import { IsEmail, IsNumber } from "class-validator";

export default class TestDto {
  @IsEmail()
  email: string;

  @IsNumber()
  testNumber: number;
}
```
Then, add the middleware to your handler like this:
```typescript
export default class UserController extends ApiController {
    constructor() {
        super("/auth");

        this.addHandler(HttpMethod.GET, "/", this.test(), DtoMapper.fromBody(TestDto));
    }

    private test(req: Request, res: Response, next: NextFunction) {
        return async (req: Request, res: Response) => {
           return res.status(HttpStatusCode.OK).send("Test Auth");
        }
    }
}
```
Finally, add an instance of your controller to `main.ts` here:
```typescript
static async init() {
  // Other initializations

  // -----------------------------

  this._application = new WebApi(Globals.APP_PORT, [
    // Add your controllers here
    new YourController()
    // -------------------------
  ]);
}
```
## Model
For database, you can learn TypeORM [here](https://typeorm.io/). You can find some data source configs in `datasource.config.ts` and the data source for app is in `app-data-source.ts`.
```shell
# Generate migration
npm run typeorm:gen

# Run migration
npm run typeorm:run
```
You can access database by using `Main.DataSource`
## Middleware
There are 2 types of middleware in this project: `global` and `handler`. Middleware can be used for filtering, authorizing, logging, pre-processing, etc. Both global and handler middleware should be construct base on `RequestHandler` imported from `core/api-controller.ts`. Global middleware is put in the middleware section in the constructor of `WebApi` at file `web-api.ts`:
```typescript
constructor(
	private readonly port: number,
	private readonly controllers: Array<ApiController>
) {
	this.app = Express();
	// Add your global middlewares here
	this.app.use(RequestInitializer);
	this.app.use(bodyParser.json());
	this.app.use(bodyParser.urlencoded({ extended: true }));
	this.app.use(cors());

	// -------------------------
	for (let controller of this.controllers) {
		this.app.use(controller.Path, controller.Router);
	}
	this.app.use(NotFoundHandler);
	this.app.use(ErrorHandler);
}
```
For handler middleware, we can put it after the handler in the `addHandler` method like this:
```typescript
this.addHandler(HttpMethod.GET, "/middleware-hi", this.testWithMiddleware, DemoMiddleware.sayHi());
```
Here is an example of a middleware container file:
```typescript
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
```
Notice that we can set value for `req.custom` and then get it later from other middleware or handler. You shouldn't override `req.custom` like this:
```typescript
req.custom = { hello: "world" };
```
Instead, use spread operator or simply add another property to it:
```typescript
req.custom = {
  ...req.custom,
  hello: "world"
};
```
or
```typescript
req.custom.hello = "world";
```
## List API
You can keep track of your APIs using `Main.Application.Controllers`. Here is the example of it:
```typescript
// list-api.controller.ts

export default class ListApiController extends ApiController {
    constructor() {
        super("/list-api");
        this.addHandler(HttpMethod.GET, "/", this.listAPI());
    }

    private listAPI() {
        return async (req: Request, res: Response) => {
            const data = Main.Application.Controllers.map((controller) => ({
                controller: controller.Path,
                handlers: controller.Handlers,
            }));
            return res.status(200).send(data);
        }
    }
}
```
Call `GET /list-api/` and you will receive a JSON like this:
```
[{"controller":"/list-api","handlers":["GET /list-api/"]},{"controller":"/test","handlers":["GET /test/","GET /test/middleware-hi","GET /test/middleware-hello"]},{"controller":"/user","handlers":["GET /user/","POST /user/upload-avt"]}]
```