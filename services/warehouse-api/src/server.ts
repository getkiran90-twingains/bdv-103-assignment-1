import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { RegisterRoutes } from "../build/routes";
import { startWarehouseSubscriber } from "./messaging/subscribe";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

RegisterRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = Number(process.env.PORT ?? 3002);

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Warehouse API running on http://0.0.0.0:${PORT}`);

  try {
    await startWarehouseSubscriber();
  } catch (error) {
    console.error("Failed to start warehouse subscriber:", error);
  }
});