const express = require('express');
var app = express()
const path = require('path');
//const http = require("http")

const port = process.env.PORT || 8080;


// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
    console.log("T1 success")
  });
  
app.post('/', function(req, res) {
    console.log("T2 success")
    
  });


  fs.writeFile("test.json", JSON.stringify(input), err => {
     
    // Checking for errors
    if (err) throw err; 
   
    console.log("Done writing"); // Success
});

app.listen(port);
console.log('Server started at http://localhost:' + port);



//todo, figure out how data input works https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms ()