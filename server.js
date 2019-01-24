var http = require('http');
var app = require("./app")
console.log("Server.js")
http.createServer(app.handleRequest).listen(8000)