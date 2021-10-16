import { Request, Response, NextFunction } from "express";

export const IsAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.body.accessToken;
  if (!accessToken) return res.sendStatus(401);
  if (accessToken.role !== "ADMIN") return res.sendStatus(403);
  else return next();
};
