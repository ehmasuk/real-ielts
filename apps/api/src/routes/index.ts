import authRoutes from "./auth.js";
import bookRoutes from "./book.routes.js";
import adminBookRoutes from "./admin.book.routes.js";
import testRoutes from "./test.routes.js";
import adminTestRoutes from "./admin.test.routes.js";
import bugReportRoutes from "./bug-report.routes.js";
import adminBugReportRoutes from "./admin.bug-report.routes.js";

const routes = (app: any): void => {
  app.use("/api/auth", authRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/tests", testRoutes);
  app.use("/api/admin/books", adminBookRoutes);
  app.use("/api/admin/tests", adminTestRoutes);
  app.use("/api/bug-reports", bugReportRoutes);
  app.use("/api/admin/bug-reports", adminBugReportRoutes);
};

export default routes;
