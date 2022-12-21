import express, { json } from 'express';
var app = express()
import { join } from 'path';
import test from "./test.json" assert {type: "json"};
import fs from "fs";
import { body, validationResult } from "express-validator";
import argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


async function hashit(UP_Pass){
try {
  let pre_hash_time = Date.now();
  const hash = await argon2.hash(UP_Pass,{
    type: argon2.argon2id,
    parallelism: 7,
    memoryCost: 185360,
    timeCost: 6
  });
  
  let post_hash_time = Date.now();
  console.log(hash)
  console.log((post_hash_time-pre_hash_time)/1000 + "s")
} 

catch (err) { 
  console.log(err)
  //...
}
}

app.use(json({extended: true, limit: '1mb'}))

const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.sendFile(join(__dirname, './public/index.html'));
    console.log("Successful client connection")
  });

  app.post('/register',
  body("name", "Empty name").trim().isLength({ min: 1 }).escape(),
  body('email', "Not an email").isEmail().normalizeEmail(),
  body("password", "Password is too short, min 6 characters").trim().isLength({min:6}).escape(),

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