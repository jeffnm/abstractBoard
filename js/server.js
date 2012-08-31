//This file is the server listener for Node.js. 
//Needs to be fixed to actually listen and print hello world
var http = require("http");

function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

http.createServer(onRequest).listen(process.env.PORT);