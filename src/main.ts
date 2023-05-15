import "reflect-metadata";
import { DataSource } from "typeorm";
import TestController from "./controllers/test/test.controller";
import Globals from "./core/globals";
import WebApi from "./core/web-api";
import AppDataSource from "./database/app-data-source";
import UserController from "./controllers/user/user.controller";
import { Logger } from "./core/logger";

export default class Main {
    private static _datasource: DataSource;
    private static _application: WebApi;
    private static _logger: Logger;

    static get DataSource(): DataSource {
        return this._datasource;
    }

    static get Application(): WebApi {
        return this._application;
    }

    static get Logger(): Logger {
        return this._logger;
    }

    static async init() {
        this._logger = new Logger("GLOBAL");
        this._datasource = await AppDataSource.initialize();
        // Add your initializations here

        // -----------------------------
        this._application = new WebApi(Globals.APP_PORT, [
            // Add your controllers here
            new TestController(),
            new UserController(),
            // -------------------------
        ]);
    }
}

Main.init().then(() => {
    Main.Application.start();
}).catch(err => {
    console.log(err);
});
