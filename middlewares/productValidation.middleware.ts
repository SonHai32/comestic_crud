import { Product } from "./../models/product.model";
import { ProductError } from "../types/productError.type";
import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
export const ProductValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let errorList: string[] = [];
    const product = req.body.product;
    console.log("product", product);
    if (product) {
      if (!product.original_price)
        errorList.push(ProductError.MSS_ORIGINAL_PRICE);
      if (!product.display_price)
        errorList.push(ProductError.MSS_DISPLAY_PRICE);
      if (!product.sell_price) errorList.push(ProductError.MSS_SELL_PRICE);
      if (!product.profit) errorList.push(ProductError.MSS_PROFIT);
      if (!product.rating) errorList.push(ProductError.MSS_RATING);
      if (!product.quantity) errorList.push(ProductError.MSS_QUANTITY);
      if (!product.brand) errorList.push(ProductError.MSS_BRAND);
      if (!product.category) errorList.push(ProductError.MSS_CATEGORY);
      if (!product.description) errorList.push(ProductError.MSS_DESCRIPTION);
      if (!product.display_image)
        errorList.push(ProductError.MSS_DISPLAY_IMAGE);
      if (!product.images_list) errorList.push(ProductError.MSS_IMAGE_LIST);
      if (!product.name) errorList.push(ProductError.MSS_NAME);
      else {
        const duplicatedName = await productService.isProductNameExisted(
          product.name,
          product._id
        );
        if (duplicatedName) errorList.push(ProductError.DUPL_NAME);
      }
      if (!product.slug) errorList.push(ProductError.MSS_SLUG);
      else {
        const duplicatedSlug = await productService.isProductNameExisted(
          product.slug,
          product._id
        );
        if (duplicatedSlug) errorList.push(ProductError.DUPL_SLUG);
      }
    } else errorList.push(ProductError.MSS_PRODUCT);

    if (errorList.length > 0) throw new Error(errorList.join(" , "));
    else return next();
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};
