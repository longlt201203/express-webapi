import { Response } from "express";
import ApiController, { HttpMethod, Request } from "../core/api-controller";
import Main from "../main";

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