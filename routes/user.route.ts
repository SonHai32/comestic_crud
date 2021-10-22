import { AuthorizationMiddleware } from './../middlewares/auth.middleware';
import {
  _Get,
  _Login,
  _Register,
  _RefreshToken,
} from "./../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route("").get(AuthorizationMiddleware, _Get)
router.route("/login").post(_Login);
router.route("/register").post(_Register);
router.route("/refreshToken").get(_RefreshToken);

export default router;
