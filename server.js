const http = require("https");
const app = require("./app");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port);
