var mongoose=require('mongoose')
var crypto=require('crypto')
var User_schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    username: {
        type:String,    
        required:true


    },
    mobile:{
        type:Number,
        required:true
    },

    address:{
            type:String,

    },
    admin:{
        type:Number,
        required:true

    },
    hash : String, 
    salt : String 


});

User_schema.methods.setPassword = function(password) { 
     
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest 
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 
     
   // Method to check the entered password is correct or not 
   // valid password method checks whether the user 
   // password is correct or not 
   // It takes the user password from the request  
   // and salt from user database entry 
   // It then hashes user password and salt 
   // then checks if this generated hash is equal 
   // to user's hash in the database or not 
   // If the user's hash is equal to generated hash  
   // then the password is correct otherwise not 
   User_schema.methods.validPassword = function(password) { 
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
       return this.hash === hash; 
   }; 
var User=module.exports = mongoose.model('User',User_schema);