import {
  _Create,
  _Get,
  _Detail,
  _Update,
  _Delete,
} from "../controllers/category.controller";
import { AuthorizationMiddleware } from "../middlewares/auth.middleware";
import { CategoryValidationMiddleware } from "../middlewares/categoryValidation.middleware";
import express from "express";
import { IsAdminMiddleware } from "../middlewares/role.middleware";

const router = express.Router();

router.route("/").get(_Get);
router
  .route("/")
  .post(
    AuthorizationMiddleware,
    IsAdminMiddleware,
    CategoryValidationMiddleware,
    _Create
  );
router.route("/detail").get(_Detail);
router.route("/").put(AuthorizationMiddleware, IsAdminMiddleware, _Update);
router.route("/").delete(_Delete);

export default router;
