import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AuthorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];

    if (!token) res.sendStatus(401);
    if (token && process.env.JWT_SECRET_KEY) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (error: any, data: any) => {
        if (error) res.sendStatus(401);
        if (data) {
          req.body.accessToken = data;
          return next();
        } else return res.sendStatus(401);
      });
    }
  } catch (error) {
    res.sendStatus(401);
  }
};
