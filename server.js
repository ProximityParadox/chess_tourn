const express = require('express');
var app = express()
const path = require('path');
//const http = require("http")
const test = require("./test.json");
const fs = require("fs");
const { body, validationResult } = require("express-validator");




app.use(express.json({extended: true, limit: '1mb'}))

const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
    console.log("Successful client connection")
  });

  app.post('/register',
  body("name", "Empty name").trim().isLength({ min: 1 }).escape(),
  body('email').isEmail().normalizeEmail(),
   body("password").isLength({min:6}),

   (req, res) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()){
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        git: "gud"
      })
    }
    console.log("Successful client data submission")
    console.log(req.body)
    // send acceptance code
    res.status(202).json({success: true})
      })
  






























//  fs.writeFile("test.json", JSON.stringify(input), err => {
     
    // Checking for errors
//    if (err) throw err; 
   
//    console.log("Done writing"); // Success
//});

app.listen(port);
console.log('Server started at http://localhost:' + port);



//todo, figure out how data input works https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms (x)
//TODO: further valida input data, save validated data, implement "login" system ()