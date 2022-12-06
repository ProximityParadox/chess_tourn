const app = require('express');
const path = require('path');
//const http = require("http")

const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  app.get('./index.js', function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.js"))
  });

app.listen(port);
console.log('Server started at http://localhost:' + port);