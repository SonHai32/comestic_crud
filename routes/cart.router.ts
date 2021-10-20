import { CartValidationMiddleware } from './../middlewares/cartValidation.middleware';
import { AuthorizationMiddleware } from './../middlewares/auth.middleware';
import { _Get, _UpdateCartQuantity, _Delete, _Insert } from "../controllers/cart.controller";
import express from "express";

const router = express.Router();
router.route("").get(AuthorizationMiddleware, _Get  );
router.route("").post(AuthorizationMiddleware, CartValidationMiddleware, _Insert)
router.route("").put(AuthorizationMiddleware,CartValidationMiddleware, _UpdateCartQuantity);
router.route("").delete(AuthorizationMiddleware, _Delete);

export default router;