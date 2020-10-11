/*var express=require('express')
var router = express.Router();
var path=require("path");
var bcrypt=require('bcryptjs')
var User=require('../models/user.js')

router.get('/register',(req,res)=>{
    res.render('register',{
        title:'Register'
    });

});
router.post('/register',(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var username=req.body.username;
    var passwprs=req.body.password;
    var password2=req.body.password2
    var err=0;

});
module.exports=router;


*/
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
// Get Users model
var User = require('../models/user');

/*
 * GET register
 */
router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Register',
        errors:0
    });

});

/*
 * POST register
 */
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    var errors = 0;

    if (name==''||email==''||username==''||password==''||password2=='') {
        res.render('register', {
            errors: 1,
            user: null,
            title: 'Register'
        });
    }
    else if(password!==password2){
        res.render('register',{
            errors: 3,
            user: null,
            title: 'Register'
        })
    } 
    else {
        User.findOne({username: username}, function (err, user) {
            if (err)
                console.log(err);

            if (user) {
                res.render('register',{
                    errors:2,
                    user:null,
                    title:'Register'
                });
            } else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    admin: 1
                });


                user.setPassword(req.body.password); 


                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/user/login')
                    }
                });
            
              /*  bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.redirect('/user/login')
                            }
                        });
                    });
                });*/
            }
        });
    }

});

/*
 * GET login
 */
router.get('/login', function (req, res) {
    if (req.app.locals.email)
    {res.redirect('/');}
    else{
        res.render('login.ejs', {
            title: 'Log in',
        });
}

});

/*
 * POST login
 */
router.post('/login', function (req, res, next) {
    var password=req.body.password;
    var username=req.body.username;
       User.findOne({email:username},(err,p)=>{
        if (p === null) { 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } 
        else { 
            if (p.validPassword(req.body.password)) { 
                var Cart=require('../models/cartm')
                req.app.locals.cart=0;
                req.app.locals.name=p.name
                req.app.locals.email=p.email
                req.app.locals.id=p._id;
                Cart.find((err,c)=>{
                    if(err)
                    console.log(err)
                    else
                    {
                        
                        req.app.locals.carts=c;
                    }
                })
                Cart.count({PersonId:p._id},(err,rs)=>{
                    if(err)
                    console.log(err)
                    else
                    {
                        
                        req.app.locals.cart=rs;
                    }
                })
                res.redirect('/');

            } 
            else { 

                
                res.redirect('/user/login')

            } 
        } 
        })
});

/*
 * GET logout
 */


router.get('/logout',  (req, res) =>{

        req.app.locals.name=undefined;
        req.app.locals.email=undefined;
        req.app.locals.cart=undefined;
        req.app.locals.id=undefined;
        res.redirect('/')

});


// Exports
module.exports = router;


