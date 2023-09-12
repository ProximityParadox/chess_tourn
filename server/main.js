import express, { json } from 'express';
var app = express()
import { join } from 'path';
import fs, { readFileSync } from "fs";
import { body, validationResult } from "express-validator";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { hash_it, validate_login} from "./hashing.js"
import {tourn_write_function } from "./tourn_write.js"


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
  

//ensure we store session in cookies to ensure we dont need to have user login with each new action
app.use(session({
  secret: "wlCOK66Eer5ayEJMfml6FjIVnEQxrTZWOelBIvqQDh1HKRd2xE06NtW2scetHm3GCcZPmBMFDx2ZqC37g9R1sgT65oZG4n21RYziFK6ItwjA4mK25GOI6x1uX0Nub2zBKKswbwE2fAe4brCheb7v2jtwURHHFaHJAbuUYR8iTya5vbLnF2HcbsK3ZLMp4DHXCJRdzfEv",
  resave: false,
  saveUninitialized: false,
}))

app.use(json({extended: true, limit: '1mb'}))

const port = process.env.PORT || 8080;

// send base file and notify client console of connection
app.get('/', function(req, res) {
  res.sendFile(join(__dirname, '../public/index.html'));
    console.log("Successful client connection")
  });

  //registering proccess
  //basic requirements for all three inputs
  //basic data sanitization with .escape()
app.post('/register',
  body("name", "name should be at least 3 characters long").trim().isLength({ min: 3 }).escape(),
  body('email', "Not an email").isEmail().normalizeEmail().escape(),
  body("password", "Password is too short, min 6 characters").trim().isLength({min:6}).escape(),


  //use userinputs and check validationresult function to check for errors.
  //if errors are detected, notify the user with a failure state and the aformentioned errors

  (req, res) => {
    let validation_errors = validationResult(req)
    if (!validation_errors.isEmpty()){
      return res.status(401).json({
        success: false,
        errors: validation_errors.array(),
        git: "gud"
      })
    }


    //notify server console of data submission
  console.log("Successful client data submission")

  //define variables for easier manipulation
  let User_name = req.body.name
  let User_email = req.body.email
  let User_pass = req.body.password 

  // read and parse json file
  let json = fs.readFileSync("database.json")
  let json_object = JSON.parse(json)


//check if the newly parsed JSON file already has the username
//if there is no user with this name ensure the data is properly hashed
//proceed to update the variable to remember that we're now working with a "treated" version of the user provided password
if(json_object.hasOwnProperty(User_name) !== true){
  hash_it(User_pass).then(function(res){ 
    let encrypted_pass = res

      // save data intended for json object
      let data = {User_email, encrypted_pass}
    
      // insert data into pre-existing json data
      json_object[User_name] = data
    
      // write newly updated json data back into the file
      fs.writeFileSync("database.json", JSON.stringify(json_object, null, " "))
})}


//if the parsed json file contains the same name as provided with the user we shall serve them an error state
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

//login process
//ensure same sanitation process
app.post('/login',
  body("name", "name should be at least 3 characters long").trim().isLength({ min: 3 }).escape(),
  body("password", "Password is too short, min 6 characters").trim().isLength({min:6}).escape(),

    //use userinputs and check validationresult function to check for errors.
  //if errors are detected, notify the user with a failure state and the aformentioned errors
   async (req, res) => {
    let validation_errors = validationResult(req)
    if (!validation_errors.isEmpty()){
      return res.status(400).json({
        success: false,
        errors: validation_errors.array(),
        git: "gud"
      })
    }
    console.log(req)

    //define variables for easier manipulation
    let User_name = req.body.name
    let User_pass = req.body.password 

    //validate login attempt
    let login_attempt = await validate_login(User_name, User_pass)


    //define success state
    if(login_attempt == "user login success"){

    //create session information
    res.locals.username = User_name
    req.session.loggedIn = true
    req.session.username = res.locals.username
    req.session.UniqueSessionID = Math.random()*10000000000000000,    
    req.session.submitted_tourn = false
    
    //return a success state to the user with the  tag proceed:true to automatically have the website shuffle the user off the login page
    return res.status(200).json({
      proceed: true,
      status: "success"})
    }
    //if the validation attempt is a failure return appropriate warning
    else{
      return res.status(401).json({
        success: false,
        status: login_attempt,
        git: "gud"
      })
    }
},
)

//ensure that the user must have a successful login validation before allowing the user to proceed
app.get("/LoginSuccess", function( req, res ){
  if(req.session.loggedIn){
  res.sendFile(join(__dirname, '../public/scheduler.html'));

  //notify server of login success
  console.log("login was a success")}
})

//read stats from tournament database file and provide at logged in users request
app.get("/tournament_stats_data", async function( req, res ){
  console.log("tournament_stats_data requested")

  let json = fs.readFileSync("tourn_winners.json")
  let json_object = JSON.parse(json)
 
  res.status(202).json( json_object )
})



//handling the non-userdata database.
app.post('/TournInfo', function( req, res){

  //check tourn_write.js for explanation
  tourn_write_function(req)

      //return acceptance as we are not informing user or success or failure.
      res.status(202).json( { success: true } )
})


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