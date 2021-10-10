import { CategoryFilter } from "./../models/cat-query.model";
import { CategoryResponse } from "./../models/cat-response.model";
import { Cat } from "./../models/cat.model";
import { Request, Response } from "express";
import CategoryService from "../services/category.service";
import { Timestamp } from "bson";
("use strict");

export const _get = async (req: Request, res: Response) => {
  try {
    const page = parseInt(
      (req.query.page as string) || (req.body.page as string)
    );
    const perPage = parseInt(
      (req.query.perPage as string) || (req.body.perPage as string)
    );

    const query: CategoryFilter = {
      page: page ? page : 0,
      perPage: perPage ? perPage : 0,
    };
    let nameSort = req.query.nameSort || req.body.nameSort;
    if (nameSort) {
      nameSort = (nameSort as string).trim().toLowerCase();
      if (nameSort !== "asc" && nameSort !== "desc") {
        throw new Error("Sort type must be asc or desc");
      } else {
        query.nameSort = nameSort === "asc" ? 1 : -1;
      }
    }
    const categoryResponse: CategoryResponse =
      await CategoryService.getAllCategory(query);
    if (res) {
      res.json(categoryResponse);
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};

export const _detail = async (req: Request, res: Response) => {
  try {
    if (req.query.cat_id) {
      const category: Cat | null = await CategoryService.getCategoryByID(
        req.query.cat_id as string
      );
      if (category) {
        res.json({
          status: "SUCCESS",
          category,
        });
      } else throw new Error("No Data Found");
    } else throw new Error(" **cat_id** NOT FOUND");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};

export const _create = async (req: Request, res: Response) => {
  try {
    const { cat_id, cat_name, sub_cate } = req.body || req.query;
    if (!cat_id) {
      throw new Error("Missing cat_id");
    } else if (!cat_name) {
      throw new Error("Missing cat_name");
    } else if (
      (await CategoryService.getCategoryByID(cat_id))?.cat_id !== undefined
    ) {
      throw new Error("Duplicated cat_id");
    } else if (
      (await CategoryService.getCategoryByName(cat_name))?.cat_name !==
      undefined
    ) {
      throw new Error("Duplicated cat_name");
    } else {
      const result = await CategoryService.insertCategory({
        cat_id,
        cat_name,
        sub_cate,
        created_at: Timestamp.fromInt(Date.now()),
        updated_at: Timestamp.fromInt(Date.now()),
      } as Cat);
      if (result.insertedId) {
        res.json({
          status: "SUCCESS",
          message: "Category inserted",
        });
      } else {
        throw new Error("Category not inserted");
      }
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
export const _update = async (req: Request, res: Response) => {
  try {
    const id: string = req.body.id;
    const cate: any = req.body.category as Cat;
    if (!id) {
      throw new Error("Missing id");
    }
    if (!cate) {
      throw new Error("Missing category document");
    }
    if (id && cate) {
      delete cate["_id"];
      const result = await CategoryService.updateCategory(id, {
        ...cate,
        updated_at: Timestamp.fromInt(Date.now()),
      });
      if (result.matchedCount > 0) {
        res.json({
          status: "SUCCESS",
          message: `Category with id: ${id} is updated`,
        });
      } else {
        throw new Error("Update fail");
      }
    } else {
      throw new Error("Missing id, category document");
    }
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};
