import Koa from "koa";
import Router from "@koa/router";
import { createRequire } from "module";

//import bookRoutes from "./books/books.routes";
import warehouseRoutes from "./warehouse/warehouse_routes";
import { RegisterRoutes } from "../build/routes";
import swaggerSpec from "../build/swagger.json";

const require = createRequire(import.meta.url);


const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const qs = require("koa-qs");

const app = new Koa();
qs(app);

app.use(cors());
app.use(bodyParser());

//app.use(bookRoutes.routes());
//app.use(bookRoutes.allowedMethods());

app.use(warehouseRoutes.routes());
app.use(warehouseRoutes.allowedMethods());

const tsoaRouter = new Router();
RegisterRoutes(tsoaRouter);

app.use(tsoaRouter.routes());
app.use(tsoaRouter.allowedMethods());

const docsRouter = new Router();

docsRouter.get("/openapi.json", (ctx) => {
  ctx.type = "application/json";
  ctx.body = swaggerSpec;
});

docsRouter.get("/docs", (ctx) => {
  ctx.type = "text/html";
  ctx.body = `
<!DOCTYPE html>
<html>
  <head>
    <title>Swagger UI</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      body { margin: 0; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/openapi.json",
          dom_id: "#swagger-ui"
        });
      };
    </script>
  </body>
</html>
`;
});

app.use(docsRouter.routes());
app.use(docsRouter.allowedMethods());

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});