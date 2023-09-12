import fs, { readFileSync } from "fs";

//handling the non-userdata database.
export function tourn_write_function(req){
    //session check to prevent spamming the database with a million requests on click
    if(req.session.submitted_tourn == false){
  
  
    req.session.submitted_tourn = true
  
    //read in database and declare variables to be clearer
    let init_submitter = req.session.username
    let json = fs.readFileSync("tourn_winners.json")
    let json_object = JSON.parse(json)
    let winner = req.body.winner
    let time = req.body.time
  
  
  
      //This checks if the winner is already part of the database or not. This is the only way to prevent an UNDEFINED or NULL error
    if(json_object[winner] !== undefined){
    let submitter = json_object[winner]
    
    //notify server
    console.log("this submission contains winner")
  
  
  let previous_submission_detected = false
  
  //
  //Warning hacky database formatting logic!
  //Warning: its formatted this way so that each winner can have each submission of their win tracked
  //Warning: this means that we're submittor, their submission amount and UNIX-date they submitted to this particular winner
  //Warning: This isn't too pretty but it provides the required functionality
  //
  
  //the variable submitter contains an array of all JSON key:value pairs of the winner's submitters
      submitter.forEach(element => {
  
  //this checks if this is NOT the first time this user has submitted a win for this person
  //if so we increase the amount of wins by 1
  //Note: we are treating the submittor with an array since the element contains not only the key:value pair, but also date:time key value pair
  
        if(element[init_submitter] !== undefined){
  
          //since the submittor already has key:value pair we can increase the keys (and thus the values) by 1
          element[init_submitter]++
          previous_submission_detected = true
        }
      });
  
      //if this is the first time we push this submission to the database
      //the submittor is an array since it JSON {} refuses to accept variables and would only insert the text "init_submittor"
      //we work around this by having the initial submittor be a single element array, and since arrays accept non-constants like a changing variable
      //we can not push the submittors information to the JSON database 
      if(previous_submission_detected == false){
        let new_sub = {[init_submitter]: 1, time}
        submitter.push(new_sub)
      }
  
      //write data to file
    Tourn_Winner_Write(winner, submitter, json_object)
    }
  
  
  
    //if the winner does not exist yet this part will run
  else{
    console.log("this is submission with no previous winner")

    //create and submit the winner along with the submittor
    //we have no correction for user error of inputted name
    //this is outside the projects scope, and this setup allows non-users to still be tracked
    //adding a conditional check for the users existance is trivial
    let submitter = [{[init_submitter]: 1, time}]
    Tourn_Winner_Write(winner, submitter, json_object)
    }
  
  }
  
  
  //defines how we write data to the file
  function Tourn_Winner_Write(winner, submitter, json_object){
      
          // insert data into pre-existing json data
          json_object[winner] = submitter

    console.log("attempting to write data to file")
  
  
  
  //adds check to see all element data before we write it
  submitter.forEach(element => {
    let a = Object.values(element)[0]
    console.log(a)
  });
          // write newly updated json data back into the file
          fs.writeFileSync("tourn_winners.json", JSON.stringify(json_object, null, " "))
  }
}