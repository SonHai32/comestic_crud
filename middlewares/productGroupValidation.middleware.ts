import { NextFunction, Request, Response } from "express";
import { ProductGroupError } from "../types/productGroupError.type";

export const ProductGroupValidationMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productGroup: Array<any> = req.body.listProductGroup;
    if (!productGroup)
      throw new Error(ProductGroupError.MSS_LIST_PRODUCT_GROUP);
    const errors: string[] = productGroup.map((val: any, index: number) => {
      const error: string[] = [];
      if (!val.status) error.push(ProductGroupError.MSS_STATUS);
      if (!val.title) error.push(ProductGroupError.MSS_TITLE);
      if (!val.group_id) error.push(ProductGroupError.MSS_GROUP_ID);
      if (val.available_in && !val.expires_in)
        error.push(ProductGroupError.MSS_EXPIRES_IN);
      if (val.expires_in && !val.available_in)
        error.push(ProductGroupError.MSS_AVAILABLE_IN);
      if (error.length > 0) {
        error.unshift(`[ERROR] Product group index at ${index}`);
      }
      return error.join(" , ");
    });

    if (errors.some((val: string) => val)) {
      throw new Error(errors.join(" , "));
    } else {
      return next();
    }
  } catch (error) {
    res.status(400).json({ status: "FAIL", message: (error as Error).message });
  }
};
