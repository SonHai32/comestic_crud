import { Request, Response, NextFunction } from "express";

export const tokenCheckedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const {token, refreshToken} = req.cookies
        if(token){
            req.headers.authorization = ''
        }
    } catch (error) {
        
    }
};
