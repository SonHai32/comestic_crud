import { Product } from "./../models/product.model";
import { ProductListQuery } from "./../models/product-query.model";
import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { InsertOneResult } from "mongodb";

("use strict");

export const _get = async (req: Request, res: Response) => {
  try {
    const query: ProductListQuery = {
      name: req.body.name || req.query.name,
      cat_id: req.body.cat_id || req.query.cat_id,
      cat_name: req.body.cat_name || req.query.cat_name,
      per_page: req.body.per_page ? parseInt(req.body.per_page as string) : 12,
      page: req.query.page ? parseInt(req.query.page as string) : 0,
    };
    if (req.query.price) {
      const price = (req.query.price as string).trim();
      if (price) {
        const priceSplit = price.split(",").map((val) => {
          return parseInt(val);
        });
        if (priceSplit.length >= 2) {
          query.price = priceSplit.splice(0, 2);
        } else {
          throw new Error("price not in Array");
        }
      }
    } else if (req.body.price) {
      const price = (req.body.price as number[]).map((val) =>
        parseInt(val.toString())
      );
      if (price.length >= 2) {
        query.price = price;
      } else {
        throw new Error("price not in Array");
      }
    }

    const productListResponse = await ProductService.getProduct(query);
    if (productListResponse.product_list) {
      res.json({ ...productListResponse, status: "SUCCESS" });
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
export const _detail = async (req: Request, res: Response) => {
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
export const _create = async (req: Request, res: Response) => {
  try {
    const request: any = req.body || req.query;
    const invalid = productValid(request);
    if (!invalid) {
      const result: InsertOneResult<Product> =
        await ProductService.InsertProduct(request as Product);
      if (result.insertedId) {
        res.json({
          status: "SUCCESS",
          message: `Product with id: ${result.insertedId} INSERTED`,
        });
      } else {
        throw new Error("ERROR WITH INSERT");
      }
    } else {
      throw new Error(`Missing Query: ${invalid}`);
    }
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};
export const _update = async (req: Request, res: Response) => {
  try {
    const request: any = req.body || req.query;
    if (request) {
      const invalid = productValid(request);
      if (!invalid) {
        if (request._id) {
          const ID = request._id;
          delete request["_id"];
          const result = await ProductService.UpdateProduct(
            request as Product,
            ID
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
      } else {
        throw new Error(`Missing query ${invalid}`);
      }
    } else {
      throw new Error("Missing request body ");
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
export const _delete = async (req: Request, res: Response) => {
  try {
    const productID = req.query.id || req.body.id || req.params.id;
    if (productID) {
      const result = await ProductService.DeleteProdct(productID as string);
      if (result) {
        res.json({
          status: "SUCCESS",
          message: `Product with ID: ${productID} DELETED`,
        });
      } else {
        throw new Error(`Product with ID: ${productID} FAIL TO DELETE`);
      }
    } else {
      throw new Error("Require ID");
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    });
  }
};
export const _deleteMany = async (req: Request, res: Response) => {
  try {
    const listOfID: string[] = req.body.listOfID || req.params.listOfID;
    if (listOfID) {
      const result = await ProductService.DeleteManyProduct(listOfID);
      if (result.deletedCount > 0) {
        res.json({ status: "SUCCESS", message: "Delete Success" });
      } else throw new Error("Delete Fail");
    } else throw new Error("Missing list product_id");
  } catch (error) {
    res.json({ status: "FAIL", message: (error as Error).message });
  }
};
const productValid = (product: any) => {
  let missingValue = "";
  const {
    product_name,
    product_price,
    product_old_price,
    product_discount,
    product_img_urls,
    product_cat,
    product_amount,
  } = product;
  if (!product_name) {
    missingValue += "product_name ;";
  }
  if (!product_price) {
    missingValue += "product_price ;";
  }
  if (!product_old_price) {
    missingValue += "product_old_price ; ";
  }
  if (!product_cat) {
    missingValue += "product_cat ;";
  }
  if (!product_discount) {
    missingValue += "product_discount";
  }
  if (!product_img_urls) {
    missingValue += "product_image_urls";
  }
  if (!product_amount) {
    missingValue += "product_amount";
  }
  return missingValue;
};
