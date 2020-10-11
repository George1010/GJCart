var LocalStrategy=require('passport-local').Strategy;
var User=require('../models/user');
var bcrypt=require('bcryptjs');



module.exports=function(passport){
    passport.use(new LocalStrategy((email,password, done)=>{
        console.log(email)
        console.log(password)
        User.findOne({email:email},(err,user)=>{
            if(err)
            {
                console.log(err)
            }
            if(user){

            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(!isMatch)
                {

                    return done(null,user);
                }
                else
                {
                    return done(null,false);
                }
            })
        }})
    }))
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })
}
