import { NextFunction, Response } from "express";
import { Request } from "../../core/api-controller";
import ApiController, { HttpMethod } from "../../core/api-controller";
import Main from "../../main";
import UserModel from "../../database/models/user.model";
import Upload from "../../core/upload";

export default class UserController extends ApiController {
	constructor() {
		super("/user");

		this.addHandler(HttpMethod.GET, "/", this.getAll());
		this.addHandler(
			HttpMethod.POST,
			"/upload-avt",
			this.uploadAvt(),
			Upload("UserAvt").single("avt")
		);
	}

	private getAll() {
		return async (req: Request, res: Response) => {
			const users = await Main.DataSource.getRepository(UserModel).find();
			return res.send(users);
		}
	}

	private uploadAvt() {
		return async (req: Request, res: Response) => {
			return res.send(`File uploaded at ${req.file?.path}`);
		}
	}
}
