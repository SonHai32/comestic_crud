import { NextFunction, Request, Response } from "express";
import { ProductGroupError } from "../types/productGroupError.type";

export const ProductGroupValidationMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productGroup: any = req.body.productGroups;
    const errors: string[] = [];

    if (!productGroup.title) errors.push(ProductGroupError.MSS_TITLE);
    if (!productGroup.group_id) errors.push(ProductGroupError.MSS_GROUP_ID);
    if (productGroup.available_in && !productGroup.expires_in)
      errors.push(ProductGroupError.MSS_EXPIRES_IN);
    if (productGroup.expires_in && !productGroup.available_in)
      errors.push(ProductGroupError.MSS_AVAILABLE_IN);

    if (errors.length > 0) {
      throw new Error(errors.join(" , "));
    } else {
      return next();
    }
  } catch (error) {
    res.status(400).json({ status: "FAIL", message: (error as Error).message });
  }
};
