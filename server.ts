import express, { Request, Response } from "express";
import cors from "cors";
import productRouter from "./routes/product.router";
import cookieParser from 'cookie-parser'
import catRouter from "./routes/category.router";
import userRouter from "./routes/user.route";
import cartRouter from "./routes/cart.router";
import orderRouter from "./routes/order.router";
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);
app.use(cookieParser())
app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.use("/api/products", productRouter);
app.use("/api/categories", catRouter);
app.use("/api/users", userRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("*", (req: Request, res: Response) => res.send("ERROR 404 NOTFOUND"));
// app.all("/", function (req: Request, res: Response, next: NextFunction) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

export default app;
