import authRoutes from "./auth.js";
import bookRoutes from "./book.routes.js";
import adminBookRoutes from "./admin.book.routes.js";
import testRoutes from "./test.routes.js";
import adminTestRoutes from "./admin.test.routes.js";
import adminBugReportRoutes from "./admin.bug-report.routes.js";
import adminMediaRoutes from "./admin.media.routes.js";
import adminUsersRoutes from "./admin.users.routes.js";
import drillProgressRoutes from "./drill-progress.routes.js";
import drillSchemaRoutes from "./drill-schema.routes.js";
import adminDrillSchemaRoutes from "./admin.drill-schema.routes.js";

import type { Express } from "express";

const routes = (app: Express): void => {
  app.use("/api/auth", authRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/tests", testRoutes);
  app.use("/api/drills", drillProgressRoutes);
  app.use("/api/drill-schema", drillSchemaRoutes);
  app.use("/api/admin/books", adminBookRoutes);
  app.use("/api/admin/tests", adminTestRoutes);
  app.use("/api/admin/bug-reports", adminBugReportRoutes);
  app.use("/api/admin/media", adminMediaRoutes);
  app.use("/api/admin/users", adminUsersRoutes);
  app.use("/api/admin/drill-schema", adminDrillSchemaRoutes);
};

export default routes;
