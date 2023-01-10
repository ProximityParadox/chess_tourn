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

async function validate_login(UP_Name, UP_Pass){
  let json = fs.readFileSync("test.json")
  let json_object = JSON.parse(json)

  let hashed_pass = json_object[UP_Name].encrypted_pass

  try{
    if(await argon2.verify(hashed_pass, UP_Pass)){
    return "user login success"
    }
  else{
    return "user login failure"  
  }}
  catch(err){
    return "server internal error"
  }
}

app.use(json({extended: true, limit: '1mb'}))

const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.sendFile(join(__dirname, './public/index.html'));
    console.log("Successful client connection")
  });

app.post('/register',
  body("name", "name should be at least 3 characters long").trim().isLength({ min: 3 }).escape(),
  body('email', "Not an email").isEmail().normalizeEmail(),
  body("password", "Password is too short, min 6 characters").trim().isLength({min:6}).escape(),

  (req, res) => {
    let validation_errors = validationResult(req)
    if (!validation_errors.isEmpty()){
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
  // read and parse json file
let json = fs.readFileSync("test.json")
let json_object = JSON.parse(json)

if(json_object.hasOwnProperty(User_name) !== true){
  // save data intended for json object
  let data = {User_email, encrypted_pass}

  // insert data into pre-existing json data
  json_object[User_name] = data

  // write newly updated json data back into the file
  fs.writeFileSync("test.json", JSON.stringify(json_object, null, " "))

  return "success"
  }
else{
  console.log("name already exists")
   return "name already exists"
}
})

// send acceptance code
res.status(202).json( { success: true } )
}
)
  
  

app.listen(port);
console.log('Server started at http://localhost:' + port);

console.log(await validate_login("test1", "password"))

//todo, figure out how data input works https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms (x)
//TODO: further valida input data, save validated data, implement "login" system ()
//TODO: login: figure out how to return error if user tries to make account with pre-existing username