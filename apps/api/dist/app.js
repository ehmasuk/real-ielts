import express, {} from "express";
import { catchGlobalErrors, notFound, } from "./middlewares/globalErrorHandlers.js";
import middlewares from "./middlewares/index.js";
import routes from "./routes/index.js";
const app = express();
// end fix
// load all middlewares
middlewares(app);
// load all routes
routes(app);
// catch not found routes and throw error
app.use(notFound);
// identify and throw global errors
app.use(catchGlobalErrors);
export default app;
//# sourceMappingURL=app.js.map