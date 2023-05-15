import Express, { Application } from "express";
import ApiController from "./api-controller";
import cors from "cors";
import bodyParser from "body-parser";
import { NotFoundHandler, ErrorHandler } from "./error-handler";
import Main from "../main";

export default class WebApi {
    private readonly app: Application;

    constructor(
        private readonly port: number,
        private readonly controllers: Array<ApiController>
    ) {
        this.app = Express();
        // Add your middlewares here
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

    start(): void {
        this.app.listen(this.port, () => {
            Main.Logger.info(`Web API is running at http://localhost:${this.port}`);
        });
    }
}