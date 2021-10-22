import { ProductFilterError } from "../types/productFilterError.type";
import { NextFunction, Request, Response } from "express";
import { ResponseType } from "../types/response.type";

export const ProductFilterValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isNumberRegex = /^-?\d*$/gm;
    const filter = req.query || req.body.filter;
    const errorList: string[] = [];

    if (!filter) return next();

    if (filter.page && !filter.perPage)
      errorList.push(ProductFilterError.MSS_PER_PAGE);

    if (filter.perPage && !filter.page)
      errorList.push(ProductFilterError.MSS_PAGE);

    if (filter.page && filter.perPage) {
      const page: string = filter.page as string;
      const perPage: string = filter.perPage as string;
      const pageIsNumber = page.match(isNumberRegex);
      const perPageIsNumber = perPage.match(isNumberRegex);

      if (!pageIsNumber) errorList.push(ProductFilterError.PAGE_NOT_NUMBER);
      else {
        if (parseInt(filter.page as string) <= 0)
          errorList.push(ProductFilterError.PAGE_LESSTHAN_0);
      }
      if (!perPageIsNumber)
        errorList.push(ProductFilterError.PER_PAGE_NOT_NUMBER);
      else {
        if (parseInt(filter.perPage as string) <= 0)
          errorList.push(ProductFilterError.PER_PAGE_LESSTHAN_0);
      }
    }

    if (filter.price) {
      const price = filter.price as string;
      if (!price.match(isNumberRegex))
        errorList.push(ProductFilterError.PRICE_NOT_NUMBER);
      else if (parseInt(price) <= 0)
        errorList.push(ProductFilterError.PRICE_LESSTHAN_0);
    }

    if (filter.priceEnd && !filter.priceStart)
      errorList.push(ProductFilterError.MSS_PRICE_START);

    if (filter.priceStart && !filter.priceEnd)
      errorList.push(ProductFilterError.MSS_PRICE_END);

    if (filter.price && filter.priceStart && filter.priceEnd)
      errorList.push(ProductFilterError.DUPLICATED_PRICE_FILTER);

    if (filter.priceStart && filter.priceEnd) {
      const priceStart = filter.priceStart as string;
      const priceEnd = filter.priceEnd as string;

      if (!priceStart.match(isNumberRegex))
        errorList.push(ProductFilterError.PRICE_START_NOT_NUMBER);
      else if (parseInt(priceStart) <= 0)
        errorList.push(ProductFilterError.PRICE_START_LESSTHAN_0);

      if (!priceEnd.match(isNumberRegex))
        errorList.push(ProductFilterError.PRICE_END_NOT_NUMBER);
      else if (parseInt(priceEnd) <= 0)
        errorList.push(ProductFilterError.PRICE_END_LESSTHAN_0);
    }

    if (errorList.length > 0) throw new Error(errorList.join(" , "));
    else return next();
  } catch (error) {
    return res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};
