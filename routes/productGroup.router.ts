import { ProductGroupValidationMiddleWare } from "./../middlewares/productGroupValidation.middleware";
import { AuthorizationMiddleware } from "./../middlewares/auth.middleware";
import { Router } from "express";
import {
  _Create,
  _Get,
  _Update,
  _Delete,
} from "../controllers/product-group.controller";

const router = Router();

router.route("").get(_Get);
router.route("").post(ProductGroupValidationMiddleWare, _Create);
router.route("").put(ProductGroupValidationMiddleWare, _Update);
router.route("").delete(_Delete);

export default router;
