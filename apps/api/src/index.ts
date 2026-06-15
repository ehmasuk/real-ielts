import http from "http";

import app from "./app.js";

// create a node server so that we can use it later with socket
const server = http.createServer(app);

const port = 8080;

server.listen(port, () => {
  console.log(`Server is running in http://localhost:${port}`);
});
