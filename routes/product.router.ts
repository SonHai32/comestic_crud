import {
  _create,
  _delete,
  _deleteMany,
  _detail,
  _get,
  _update,
} from "./../controllers/product.controller";
import express from "express";

const router = express.Router();
router.route("/").get(_get);
router.route("/product-detail").get(_detail);
router.route("/insert-product").post(_create);
router.route("/update-product").patch(_update);
router.route("/delete-product").put(_delete);
router.route("/delete-many-product").put(_deleteMany);
export default router;
