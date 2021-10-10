import { Timestamp } from "bson";
import { User } from "./../models/user.model";
import { Response, Request } from "express";
import UserService from "../services/user.service";

("use strict");

export const _login = async (req: Request, res: Response) => {
  try {
    const userAuth: any = req.body.userAuth;
    if (!userAuth) throw new Error("Missing user authentication");
    else if (!userAuth.username) throw new Error("Missing username");
    else if (!userAuth.password) throw new Error("Missing password");

    const accessToken = await UserService.authentication(
      userAuth.username,
      userAuth.password
    );
    if (accessToken) {
      res.json(accessToken);
    } else throw new Error("Error while genarate access token");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};

export const _register = async (req: Request, res: Response) => {
  try {
    const userReq = req.body.user;
    if (!userReq) throw new Error("Missing user");
    else if (!userReq.username) throw new Error("Missing username");
    else if (!userReq.password) throw new Error("Missing password");
    else if (!userReq.email_address) throw new Error("Missing email address");
    const user: User = {
      ...userReq,
      role: "USER",
      status: true,
      created_at: Timestamp.fromInt(Date.now()),
      updated_at: Timestamp.fromInt(Date.now()),
    };

    const result = await UserService.register(user);
    if (result) {
      res.json({
        status: "SUCCESS",
        message: `${user.username} has been created`,
      });
    } else {
      throw new Error("ERROR");
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
