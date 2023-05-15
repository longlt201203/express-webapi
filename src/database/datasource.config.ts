import { DataSource, QueryRunner, Logger as TypeormLoggerInterface } from "typeorm";
import Globals from "../core/globals";
import { Logger } from "../core/logger";

class TypeormLogger implements TypeormLoggerInterface {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger("DATABASE");
    }

    logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        this.logger.debug(`\nQuery: ${query}\nParameters: ${JSON.stringify(parameters)}`);
    }
    logQueryError(error: string | Error, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        this.logger.error(`\nQuery: ${query}\nParameters: ${JSON.stringify(parameters)}\nError: ${JSON.stringify(error)}}`);
    }
    logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        this.logger.warn(`\nQuery: ${query}\nParameters: ${JSON.stringify(parameters)}\nTime: ${time}`);
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
        this.logger.info(`\nSchema build: ${message}`);
    }
    logMigration(message: string, queryRunner?: QueryRunner | undefined) {
        this.logger.info(`\nMigration: ${message}`);
    }
    log(level: "warn" | "info" | "log", message: any, queryRunner?: QueryRunner | undefined) {
        switch (level) {
            case "warn":
                this.logger.warn(message);
                break;
            case "info":
                this.logger.info(message);
                break;
            case "log":
                this.logger.debug(message);
                break;
        }
    }

}

const PathOptions = {
    entities: [__dirname + "/models/*.model{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
}

const DatabaseServerOptions = {
    host: Globals.DB_HOST,
    port: Globals.DB_PORT,
    username: Globals.DB_USER,
    password: Globals.DB_PASS,
    database: Globals.DB_NAME,
};

export class MysqlDataSource extends DataSource {
    constructor() {
        super({
            type: "mysql",
            logger: new TypeormLogger(),
            logging: "all",
            ...DatabaseServerOptions,
            ...PathOptions,
        });
    }
}

export class PostgresDataSource extends DataSource {
    constructor() {
        super({
            type: "postgres",
            logger: new TypeormLogger(),
            logging: "all",
            ...DatabaseServerOptions,
            ...PathOptions,
        });
    }
};

export class SqlServerDataSource extends DataSource {
    constructor() {
        super({
            type: "mssql",
            logger: new TypeormLogger(),
            logging: "all",
            extra: {
                trustServerCertificate: true
            },
            ...DatabaseServerOptions,
            ...PathOptions,
        });
    }
};

export class SqliteDataSource extends DataSource {
    constructor() {
        super({
            type: "sqlite",
            logger: new TypeormLogger(),
            logging: "all",
            database: DatabaseServerOptions.database,
            ...PathOptions,
        });
    }
};