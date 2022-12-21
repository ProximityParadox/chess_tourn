import express, { json } from 'express';
var app = express()
import { join } from 'path';
import test from "./test.json" assert {type: "json"};
import fs, { readFileSync } from "fs";
import { body, validationResult } from "express-validator";
import argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';








const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


async function hash_it(UP_Pass){
try {
  let pre_hash_time = Date.now();
  let hash = await argon2.hash(UP_Pass,{
    type: argon2.argon2id,
    parallelism: 7,
    memoryCost: 105360,
    timeCost: 10
  });
  let post_hash_time = Date.now();
  console.log((post_hash_time-pre_hash_time)/1000 + "s")
  return hash
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
  let User_name = req.body.name
  let User_email = req.body.email
  let User_pass = req.body.password 

hash_it(User_pass).then(function(res){ 
  let encrypted_pass = res
  console.log(encrypted_pass)

let json_string = fs.readFileSync("test.json")
let json_object = JSON.parse(json_string)

console.log(json_object)

//json_object


//TODO: GET THE FUCKING SAVING SYSTEM TO WORK

  //let jdata = [JSON.parse(fs.readFileSync("test.json"))]

//json_object.push([User_name, User_email, encrypted_pass])

  //fs.writeFile("test.json", JSON.stringify(("test")), err => {
     
  //Checking for errors
  //if (err) throw err; 
  //console.log("Done writing"); // Success
//});

})

// send acceptance code
res.status(202).json({success: true})
})
  
  

app.listen(port);
console.log('Server started at http://localhost:' + port);



//todo, figure out how data input works https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms (x)
//TODO: further valida input data, save validated data, implement "login" system ()