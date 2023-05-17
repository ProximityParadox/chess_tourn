import express, { json } from 'express';
var app = express()
import { join } from 'path';
import test from "./test.json" assert {type: "json"};
import fs, { readFileSync } from "fs";
import { body, validationResult } from "express-validator";
import argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

var errors = 0





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
  console.log("hash took " + (post_hash_time-pre_hash_time)/1000 + "s")
  return hash
} 

catch (err) { 
  console.log(err)
  //...
}
}

app.use(express.static(path.join(__dirname, "public")));
  
app.use(session({
  secret: "wlCOK66Eer5ayEJMfml6FjIVnEQxrTZWOelBIvqQDh1HKRd2xE06NtW2scetHm3GCcZPmBMFDx2ZqC37g9R1sgT65oZG4n21RYziFK6ItwjA4mK25GOI6x1uX0Nub2zBKKswbwE2fAe4brCheb7v2jtwURHHFaHJAbuUYR8iTya5vbLnF2HcbsK3ZLMp4DHXCJRdzfEv",
  resave: false,
  saveUninitialized: false,
}))

async function validate_login(UP_Name, UP_Pass){
  let json = fs.readFileSync("test.json")
  let json_object = JSON.parse(json)

  try{
    let hashed_pass = json_object[UP_Name].encrypted_pass
    if(await argon2.verify(hashed_pass, UP_Pass)){
    return "user login success"
    }
  else{
    return "user login failure"  
  }}
  catch(err){
    return "user does not exist"
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
      return res.status(401).json({
        success: false,
        errors: validation_errors.array(),
        git: "gud"
      })
    }


    
  console.log("Successful client data submission")
  let User_name = req.body.name
  let User_email = req.body.email
  let User_pass = req.body.password 

        // read and parse json file
  let json = fs.readFileSync("test.json")
  let json_object = JSON.parse(json)

if(json_object.hasOwnProperty(User_name) !== true){
  hash_it(User_pass).then(function(res){ 
    let encrypted_pass = res

      // save data intended for json object
      let data = {User_email, encrypted_pass}
    
      // insert data into pre-existing json data
      json_object[User_name] = data
    
      // write newly updated json data back into the file
      fs.writeFileSync("test.json", JSON.stringify(json_object, null, " "))
})}
else{
  return res.status(400).json({
    success: false,
    errors: [{msg: "username is already in use"}],
    git: "gud"
  })
}

// send acceptance code
res.status(202).json( { success: true } )
}
)
  
app.post('/login',
  body("name", "name should be at least 3 characters long").trim().isLength({ min: 3 }).escape(),
  body("password", "Password is too short, min 6 characters").trim().isLength({min:6}).escape(),

   async (req, res, next) => {
    let validation_errors = validationResult(req)
    if (!validation_errors.isEmpty()){
      return res.status(400).json({
        success: false,
        errors: validation_errors.array(),
        git: "gud"
      })
    }
    
    let User_name = req.body.name
    let User_pass = req.body.password 

    let login_attempt = await validate_login(User_name, User_pass)

    

    if(login_attempt == "user login success"){

    res.locals.username = User_name
    req.session.loggedIn = true
    req.session.username = res.locals.username
    req.session.UniqueSessionID = Math.random()*10000000000000000,    
    req.session.submitted_tourn = false

    console.log(req.session)
    return res.status(200).json({
      proceed: true,
      status: "success"})
    }

    else{
      return res.status(401).json({
        success: false,
        status: login_attempt,
        git: "gud"
      })
    }
},
)

app.get("/LoginSuccess", function( req, res ){
  if(req.session.loggedIn){
  res.sendFile(join(__dirname, './public/scheduler.html'));
  console.log("login was a success")}
  //return res.status(200)
})

app.post('/sessiontest',function( req, res ){
console.log(req.session)
})

app.get("/tournament_stats_data", async function( req, res ){
  console.log("tournament_stats_data requested")

  let json = fs.readFileSync("tourn_winners.json")
  let json_object = JSON.parse(json)
 
  res.status(202).json( json_object )
})

app.post('/TournInfo', function( req, res){


    if(req.session.submitted_tourn == false){


  req.session.submitted_tourn = true

  res.status(202).json( { success: true } )

  let init_submitter = req.session.username


  let json = fs.readFileSync("tourn_winners.json")
  let json_object = JSON.parse(json)
  let winner = req.body.winner
  let time = req.body.time




  if(json_object[winner] !== undefined){
  let submitter = json_object[winner]

  console.log("this is submission with data in already")


let previous_submission_detected = false


    submitter.forEach(element => {
      if(element[init_submitter] !== undefined){
        element[init_submitter]++
        previous_submission_detected = true
      }

    });

    if(previous_submission_detected == false){
      let new_sub = {[init_submitter]: 1, time}
      submitter.push(new_sub)
    }


  Tourn_Winner_Write(winner, submitter, json_object)
  }
else{
  console.log("this is submission with no previous data")

  let submitter = [{[init_submitter]: 1, time}]
  Tourn_Winner_Write(winner, submitter, json_object)
  }

}
else{
  res.status(208)
}
})

function Tourn_Winner_Write(winner, submitter, json_object){
    
        // insert data into pre-existing json data
        json_object[winner] = submitter
      
  console.log("attempting to write data to file")




submitter.forEach(element => {
  let a = Object.values(element)[0]
  console.log(a)
});


        //console.log (json_object[winner])
        // write newly updated json data back into the file
        fs.writeFileSync("tourn_winners.json", JSON.stringify(json_object, null, " "))
}


app.listen(port);
console.log('Server started at http://localhost:' + port);

//todo, figure out how data input works https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms (x)
//TODO: further valida input data, save validated data (x)
//TODO: login: figure out how to return error if user tries to make account with pre-existing username (x)
//TODO: figure out how to display error message on clientside (x)
//TODO: implement "login" system (x)
//TODO: implement session and cookies %% UNSECURE (x)
//TODO: figure out why the res.sendfile is not properly updating the webpage (x)
//TODO: make use of login system to set times interested in chess (x)
//TODO: make a visual tournament system (x)
//TODO: hook up tournament system to a backend database to save winners (x)