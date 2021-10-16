import {
  _Login,
  _Register,
  _RefreshToken,
} from "./../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route("/login").post(_Login);
router.route("/register").post(_Register);
router.route("/refreshToken").get(_RefreshToken);

export default router;
