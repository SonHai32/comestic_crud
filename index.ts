import { ProductGroupService } from "./services/product-group.service";
import { MongoClient, MongoError } from "mongodb";
import server from "./server";
import dotenv from "dotenv";
import ProductService from "./services/product.service";
import CategoryService from "./services/category.service";
import UserService from "./services/user.service";
import CartService from "./services/cart.service";
import OrderService from "./services/order.service";
import { TokenService } from "./services/token.service";
dotenv.config();

if (process.env.CONNECT_DB_URI) {
  const PORT = process.env.PORT || 8080;
  MongoClient.connect(process.env.CONNECT_DB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 5000,
  })
    .catch((err: MongoError) => {
      console.log(err.stack);
      process.exit(1);
    })
    .then(async (client: MongoClient) => {
      await ProductService.injectDB(client);
      await CategoryService.injectDB(client);
      await UserService.injectDB(client);
      await CartService.injectDB(client);
      await OrderService.injectDB(client);
      await TokenService.injectDB(client);
      await ProductGroupService.injectDB(client);
      server.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running on localhost: ${PORT}`);
      });
    });
}
