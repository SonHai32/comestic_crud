import express from "express";
import { _Get, _Update } from "../controllers/order.controller";
const router = express.Router();
router.route("").get(_Get);
router.route("").put(_Update);

export default router;
