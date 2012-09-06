

var nstatic = require('node-static'),
    http = require('http');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(nstatic.Server)('./');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    });
}).listen(process.env.PORT);