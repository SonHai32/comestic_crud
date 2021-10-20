import jwt from "jsonwebtoken";
import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { CategoryFilter } from "../models/category-filter.model";
import { CategoryResponse } from "../models/category-response.model";
import { Category } from "../models/category.model";
import { Request, Response } from "express";
import { Timestamp } from "bson";
import { ResponseType } from "../types/response.type";
import CategoryService from "../services/category.service";

export const _Get = async (req: Request, res: Response) => {
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

export const _Detail = async (req: Request, res: Response) => {
  try {
    if (req.query.id) {
      const category: Category | null = await CategoryService.getCategoryByID(
        req.query.id as string
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

export const _Create = async (req: Request, res: Response) => {
  try {
    const category: Category = req.body.category;
    const accessToken: any = req.body.accessToken;
    if (category && accessToken) {
      const categoryMapToBson: Category = {
        ...category,
        created_by: accessToken._id,
        created_at: new Date(),
        last_modified: {
          update_by: accessToken._id,
          updated_at: new Date(),
        },
      };
      const insertResult: InsertOneResult<Category> =
        await CategoryService.insertCategory(categoryMapToBson);
      if (insertResult.insertedId) {
        res.json({
          status: "SUCCESS",
          message: `Category with id: ${insertResult.insertedId} inserted`,
        });
      } else throw new Error("Fail to insert new category");
    } else throw new Error("Missing category or access token");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
export const _Update = async (req: Request, res: Response) => {
  try {
    const accessToken: any = req.body.accessToken; //accessToken passing in authorization middleware
    let category: Category = req.body.category;
    if (accessToken && category) {
      const _id: string = category._id ? category._id : "";
      delete category._id; // remove _id to update document without error
      category = {
        ...category,
        last_modified: {
          update_by: accessToken._id,
          updated_at: new Date(),
        },
      };
      const updateResult: UpdateResult = await CategoryService.updateCategory(
        _id,
        category
      );
      if (updateResult.matchedCount > 0)
        res.json({
          status: "SUCCESS",
          message: `Category with _id: ${_id} was updated by user: ${accessToken._id}`,
        } as ResponseType);
      else throw new Error("Fail to update Category");
    } else throw new Error("Missing category or accessToken");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};

export const _Delete = async (req: Request, res: Response) => {
  try {
    const listID: string[] = req.body.listOfID;
    console.log(req.body)
    if (listID) {
      const result: DeleteResult | undefined =
        await CategoryService.deleteCategory(listID);
      if (result && result.deletedCount > 0)
        res.json({ status: "SUCCESS", message: "Deleted" } as ResponseType);
      else throw new Error("Delete fail");
    } else throw new Error("No list to delete");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};
