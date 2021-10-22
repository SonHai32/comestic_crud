import { Product } from "./../models/product.model";
import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { InsertOneResult } from "mongodb";

export const _Get = async (req: Request, res: Response) => {
  try {
    const query: any = req.body.query || req.query;
    const mapQuery: any = {
      ...query,
      page: query.page ? parseInt(query.page) : null,
      perPage: query.perPage ? parseInt(query.perPage) : null,
    };
    let result = await (mapQuery
      ? ProductService.getProduct(mapQuery)
      : ProductService.getProduct());
    return res.json(result);
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};

export const _Detail = async (req: Request, res: Response) => {
  if (req.query.id) {
    try {
      const product: Product | null = await ProductService.getProductDetail(
        req.query.id as string
      );
      if (product) {
        res.json({
          status: "SUCCESS",
          product: product,
        });
      } else {
        throw new Error("Product not found");
      }
    } catch (err) {
      res.json({
        status: "FAIL",
        message: (err as Error).message,
      });
    }
  }
};

export const _Create = async (req: Request, res: Response) => {
  try {
    const product: Product = req.body.product;
    const accessToken = req.body.accessToken;
    if (accessToken) {
      const result: InsertOneResult<Product> =
        await ProductService.InsertProduct(accessToken, product);
      if (result.insertedId) {
        res.json({
          status: "SUCCESS",
          message: `Product with id: ${result.insertedId} INSERTED`,
        });
      } else {
        throw new Error("ERROR WITH INSERT");
      }
    } else throw new Error("Missing access token");
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};

export const _Update = async (req: Request, res: Response) => {
  try {
    const product: Product = req.body.product;
    const accessToken: any = req.body.accessToken;
    if (product) {
      if (product._id) {
        const ID = product._id;
        delete product["_id"];
        const result = await ProductService.UpdateProduct(
          product,
          ID,
          accessToken
        );
        if (result.matchedCount) {
          res.json({
            status: "SUCCESS",
            message: `UPDATE product with ID ${result.upsertedId}`,
          });
        } else {
          throw new Error("Update Fail");
        }
      } else {
        throw new Error(`Missing ID`);
      }
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};

export const _Delete = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const listOfID: string[] = req.body.listOfID;
    if (listOfID) {
      const result = await ProductService.DeleteManyProduct(listOfID);
      if (result.deletedCount > 0) {
        return res.json({ status: "SUCCESS", message: "Delete Success" });
      } else throw new Error("Delete Fail");
    } else throw new Error("Missing list product_id");
  } catch (error) {
    return res.json({ status: "FAIL", message: (error as Error).message });
  }
};
