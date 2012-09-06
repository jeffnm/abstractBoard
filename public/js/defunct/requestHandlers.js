var querystring = require("querystring"),
    fs = require("fs");

function start(response, pathname, postData) {
    console.log("Request handler 'start' was called.");
    
    if(pathname === "/"){
        pathname = "game.html";
    }
        
    fs.readFile("game.html","binary",function(error,file){
        if(error){
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        }else{
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(file);
            response.end();   
        }
    })   
}

function upload(response, pathname, postData) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You've sent: " + querystring.parse(postData).text);
    response.end();
}


exports.start = start;
exports.upload = upload;
