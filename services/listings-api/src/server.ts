import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { RegisterRoutes } from "../build/routes";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

RegisterRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = Number(process.env.PORT ?? 3001);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listings API running on http://0.0.0.0:${PORT}`);
});