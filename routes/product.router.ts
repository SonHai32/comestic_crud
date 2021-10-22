import { ProductFilterValidationMiddleware } from "./../middlewares/productFilterValidation.middleware";
import { IsAdminMiddleware } from "./../middlewares/role.middleware";
import {
  _Create,
  _Delete,
  _Detail,
  _Get,
  _Update,
} from "./../controllers/product.controller";
import express from "express";
import { AuthorizationMiddleware } from "../middlewares/auth.middleware";
import { ProductValidationMiddleware } from "../middlewares/productValidation.middleware";

const router = express.Router();
router.route("/").get(ProductFilterValidationMiddleware, _Get);
router.route("/:id").get(_Detail);
router
  .route("/")
  .post(
    AuthorizationMiddleware,
    IsAdminMiddleware,
    ProductValidationMiddleware,
    _Create
  );
router
  .route("/")
  .patch(
    AuthorizationMiddleware,
    IsAdminMiddleware,
    ProductValidationMiddleware,
    _Update
  );
// router.route("/").put(_DeleteMany);
router.route("/").delete(AuthorizationMiddleware, IsAdminMiddleware, _Delete);
export default router;
