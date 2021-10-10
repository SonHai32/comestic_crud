import { _login, _register } from "./../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.route("/login").post(_login);
router.route("/register").post(_register);

export default router;
