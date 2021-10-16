import { _Get, _Update, _Delete } from "../controllers/cart.controller";
import express from "express";

const router = express.Router();
router.route("").get(_Get);
router.route("").put(_Update);
router.route("").delete(_Delete);

export default router;
