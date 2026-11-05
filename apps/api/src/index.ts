import http from "http";

import app from "./app.js";

// create a node server so that we can use it later with socket
const server = http.createServer(app);

// Vercel's zero-config Express runtime injects PORT; 8080 is the local
// fallback. The DB connection is started in app.ts.
const port = Number(process.env.PORT) || 8080;

server.listen(port, () => {
  console.log(`Server is running in http://localhost:${port}`);
});
