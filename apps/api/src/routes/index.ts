import authRoutes from "./auth.js";

const routes = (app: any): void => {
  app.use("/api/auth", authRoutes);
};

export default routes;
