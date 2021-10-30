import { ProductGroup } from "./../models/product-group.model";
import { ProductGroupService } from "./../services/product-group.service";
import { Request, Response } from "express";
import { DeleteResult, InsertManyResult, UpdateResult } from "mongodb";

export const _Get = async (req: Request, res: Response) => {
  try {
    const result: ProductGroup[] = await ProductGroupService.GetProductGroup();

    return res.status(200).json({
      status: result ? "SUCCESS" : "FAIL",
      product_groups: result,
    });
  } catch (error) {
    return res.json({ status: "FAIL", message: (error as Error).message });
  }
};

export const _Create = async (req: Request, res: Response) => {
  try {
    const listProductGroup: ProductGroup[] = req.body.listProductGroup;
    const username: string = req.body.accessToken.username;
    const result: InsertManyResult =
      await ProductGroupService.InsertProductGroup(username, listProductGroup);
    if (result.insertedCount > 0) {
      return res.status(201).json({
        status: "SUCCESS",
        message: "Data inserted",
      });
    } else {
      throw new Error("Insert fail");
    }
  } catch (error) {
    return res.json({ status: "FAIL", message: (error as Error).message });
  }
};

export const _Update = async (req: Request, res: Response) => {
  try {
    const listUpdate: ProductGroup[] = req.body.listUpdate;
    const createdBy: string = req.body.accessToken.username;
    const updateResult: UpdateResult[] =
      await ProductGroupService.UpdateProductGroup(createdBy, listUpdate);
    const resultCount = updateResult
      .map((val: UpdateResult) => val.modifiedCount)
      .reduce((pre: number, curr: number) => pre + curr);
    if (resultCount > 0) {
      return res.status(200).json({
        status: "SUCCESS",
        message: `${resultCount} document updated`,
      });
    } else {
      throw new Error("Update fail");
    }
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};

export const _Delete = async (req: Request, res: Response) => {
  try {
    const listID: string[] = req.body.listID;
    const result: DeleteResult = await ProductGroupService.DeleteProductGroup(
      listID
    );
    if (result.deletedCount > 0) {
      return res.status(200).json({
        status: "SUCCESS",
        message: `${result.deletedCount} Documents deleted`,
      });
    } else {
      throw new Error("Delete fail");
    }
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};
