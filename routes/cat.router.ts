import {
  _create,
  _get,
  _detail,
  _update,
} from "./../controllers/category.controller";
import { adminAuthorizationMiddleware } from "../middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.route("/").get(adminAuthorizationMiddleware, _get);
router.route("/create").post(_create);
router.route("/update").patch(_update);
router.route("/detail").get(_detail);

export default router;
