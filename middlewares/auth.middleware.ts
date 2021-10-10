import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
("use strict");

dotenv.config();
export const adminAuthorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  //admin middle ware
  const token = authorization?.split(" ")[1];

  if (!token) res.sendStatus(401);
  if (token && process.env.JWT_SECRET_KEY) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error: any, data: any) => {
      if (error) res.sendStatus(403);
      if (data) {
        if (data.role !== "ADMIN") res.sendStatus(401);
        else {
          next();
        }
      }
    });
  }
};
