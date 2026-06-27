import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";

// create a node server so that we can use it later with socket
const server = http.createServer(app);

const port = 8080;

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
  });
});
