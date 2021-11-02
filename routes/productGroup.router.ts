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

router.route("").get(AuthorizationMiddleware, _Get);
router
  .route("")
  .post(AuthorizationMiddleware, ProductGroupValidationMiddleWare, _Create);
router.route("").put(AuthorizationMiddleware, _Update);
router.route("").delete(AuthorizationMiddleware, _Delete);

export default router;
