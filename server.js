const http = require("https");
const app = require("./app");

const port = process.env.PORT || 4444;

const server = http.createServer(app);

server.listen(port);
