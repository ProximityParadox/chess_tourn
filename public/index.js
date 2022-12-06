const prompt = require('prompt');

const test = require("../test.json");

const fs = require("fs");

//console.log(test)

function testcase(){

    let name = prompt("yeå")
    let age = prompt("dog")
    let language = prompt("syka")
    let t_array = [name, age, language]
    return t_array
}

//test.push(testcase())

fs.writeFile("test.json", JSON.stringify(test), err => {
     
    // Checking for errors
    if (err) throw err; 
   
    console.log("Done writing"); // Success
});

function please(){
    console.log("hello")
}
please()

// Read users.json file
fs.readFile("test.json", function(err, data) {
      
    // Check for errors
    if (err) throw err;
   
    // Converting to JSON
    const users = JSON.parse(data);
      
    console.log(users); // Print users 
});
