const http = require("http");
const app = require("./app");

const port = process.env.PORT || 8080;

const server = http.createServer(app);
console.log("port", port);
server.listen(port, "0.0.0.0");
