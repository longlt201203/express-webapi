import { Response } from "express";
import { HttpStatusCode, Request } from "../../core/api-controller";
import ApiController, { HttpMethod } from "../../core/api-controller";
import DtoMapper from "../../core/dto-mapper";
import TestDto from "./test.dto";
import Main from "../../main";

export default class TestController extends ApiController {
    constructor() {
        super("/test");

        this.addHandler(HttpMethod.GET, "/", this.getTest, DtoMapper.fromQuery(TestDto));
    }

    private async getTest(req: Request, res: Response) {
        // throw new Error("test error!!!!!!");
        const dto: TestDto = req.query;
        // Main.Logger.debug(`Test dto:\n${JSON.stringify(dto, null, 2)}`);
        return res.status(HttpStatusCode.OK).send("Hello World!");
    }
}