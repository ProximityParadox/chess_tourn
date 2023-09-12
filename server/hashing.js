import argon2 from 'argon2';
import fs, { readFileSync } from "fs";



export async function hash_it(UP_Pass){
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

export async function validate_login(UP_Name, UP_Pass){
        let json = fs.readFileSync("database.json")
        let json_object = JSON.parse(json)
      
        console.log(json_object)

        console.log(json_object[UP_Name])



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