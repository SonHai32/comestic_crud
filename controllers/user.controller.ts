import { TokenService } from "./../services/token.service";
import jwt from "jsonwebtoken";
import { Timestamp } from "bson";
import { User } from "./../models/user.model";
import { Response, Request } from "express";
import UserService from "../services/user.service";

export const _Login = async (req: Request, res: Response) => {
  try {
    const username: any = req.body.username;
    const password: any = req.body.password;
    if (!username && !password) throw new Error("Missing user authentication");
    else if (!username) throw new Error("Missing username");
    else if (!password) throw new Error("Missing password");

    const accessToken: any = await UserService.authentication(
      username,
      password
    );
    if (accessToken) {
      res.cookie("refreshToken", accessToken.refreshToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        sameSite: "strict",
      });
      res.header("Access-Control-Allow-Origin", "http://localhost:4200");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.status(200).json({
        token: {
          accessToken,
          expiresIn: new Date(new Date().getTime() + 20 * 1000),
        },
      });
    } else throw new Error("Error while genarate access token");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
export const _Get = async (req: Request, res: Response) => {
  try {
    const accessToken = req.body.accessToken;
    if (!accessToken) throw new Error("Missing accessToken");
    else return res.json({ status: "SUCCESS", accessToken });
  } catch (error) {
    return res.json({ status: "FAIL", message: (error as Error).message });
  }
};

export const _Register = async (req: Request, res: Response) => {
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

export const _RefreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);
    const refreshTokenInvalid = await TokenService.checkRefreshToken(
      refreshToken
    );
    if (!refreshTokenInvalid) return res.sendStatus(401);
    if (process.env.JWT_RETOKEN_SECRET_KEY) {
      jwt.verify(
        refreshToken,
        process.env.JWT_RETOKEN_SECRET_KEY,
        (error: any, data: any) => {
          if (error) return res.sendStatus(401);
          if (!data) return res.sendStatus(401);
          if (process.env.JWT_SECRET_KEY) {
            const accessToken = jwt.sign(
              data.user,
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "20s",
              }
            );
            return res.status(200).json({
              token: {
                accessToken,
                expiresIn: new Date(new Date().getTime() + 20 * 1000),
              },
            });
          } else return res.sendStatus(401);
        }
      );
    }
  } catch (error) {}
};
