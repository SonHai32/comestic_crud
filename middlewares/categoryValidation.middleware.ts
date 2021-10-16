import  jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { CategoryError } from "../types/categoryError.type";
import CategoryService from "../services/category.service";
export const CategoryValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
        const category: any = req.body.category;
    const errors: string[] = [];
    if (!category) errors.push(CategoryError.MSS_CATEGORY);
    else {
      if (!category.name) errors.push(CategoryError.MSS_NAME);
      else {
        const isNameExisted = await CategoryService.isNameExisted(
          category.name
        );
        if (isNameExisted) errors.push(CategoryError.DUPL_NAME);
      }
      if (!category.slug) errors.push(CategoryError.MSS_SLUG);
      else {
        const isSlugExisted = await CategoryService.isNameExisted(
          category.slug
        );
        if (isSlugExisted) errors.push(CategoryError.DUPL_SLUG);
      }
    }

    if (errors.length > 0) throw new Error(errors.join(" , "));
    else {
      return next();
    }
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};
