import { NextFunction, Response } from "express";
import { Request } from "../../core/api-controller";
import ApiController, { HttpMethod } from "../../core/api-controller";
import Main from "../../main";
import UserModel from "../../database/models/user.model";
import Upload from "../../core/upload";

export default class UserController extends ApiController {
    constructor() {
        super("/user");

        this.addHandler(HttpMethod.GET, "/", this.getAll);
        this.addHandler(HttpMethod.POST, "/upload-avt", this.uploadAvt, Upload("UserAvt").single("avt"));
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const users = await Main.DataSource.getRepository(UserModel).find();
        return res.send(users);
    }

    async uploadAvt(req: Request, res: Response, next: NextFunction) {
        return res.send(`File uploaded at ${req.file?.path}`);
    }
}