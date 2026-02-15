import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';
import bookRoutes from './books/book_routes';
import warehouseRoutes from "./warehouse/warehouse_routes";

const app = new Koa();
qs(app);

app.use(cors());
app.use(bodyParser());
app.use(bookRoutes.routes());
app.use(bookRoutes.allowedMethods());
app.use(warehouseRoutes.routes());
app.use(warehouseRoutes.allowedMethods());

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});