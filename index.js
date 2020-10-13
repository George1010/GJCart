var express=require("express");
var app=express();
var session = require('express-session');
var path=require("path");
var mongoose=require('mongoose');
var config=require('./config');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser')
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
//...


mongoose.connect(config.dbURL, {useNewUrlParser: true});
app.use(express.static('/public'));
app.use('/css',express.static(path.join(__dirname,'public/css')));
app.use('/images',express.static(path.join(__dirname,'public/images')))
app.use('/product_images',express.static(path.join(__dirname,'public/product_images')))

app.set('/views',path.join(__dirname,'views'));
app.set('/layouts',path.join(__dirname,'views/layouts'));


app.set('view engine','ejs');

var db = mongoose.connection;
db.on('open', ()=> {
    console.log("connected");
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())
 

app.use(cookieParser('keyboard cat'))
app.use(session({ 	
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));


var page=require('./models/page')
page.find({}).sort({sorting:1}).exec((err,pages)=>{
    if(err)
    console.log(err)
    else
    {
        app.locals.pages=pages;
    }
})
var category=require('./models/categories')
category.find((err,cat)=>{
    if(err)
    console.log(err)
    else
    {
        
        app.locals.categories=cat;
    }
})

var cart=require('./models/categories')
cart.find((err,c)=>{
    if(err)
    console.log(err)
    else
    {
        
        app.locals.carts=c;
    }
})
/*
app.use("*",function(req, res, next) {
    app.locals.name = req.session.name;
    app.locals.email=req.session.email;
    next();
  });
  */



var User=require('./models/user')
require('./config/passport.js')(passport)
app.use(passport.initialize());
app.use(passport.session());










var cart=require('./routes/cart');
var pages=require('./routes/pages.js');
var users=require('./routes/user.js');
var adminpages=require('./routes/adminpages.js');
var admincat=require('./routes/admincat.js');
var adminpro=require('./routes/adminpro.js');
var products=require('./routes/products.js');
app.use('/admin/pages',adminpages);
app.use('/admin/cat',admincat);
app.use('/admin/products',adminpro);
app.use('/products',products);
app.use('/cart',cart);
app.use('/user',users);
app.use('/',pages);












var port=process.env.PORT||3000
app.listen(port,()=>{
    console.log("Started");
});
module.exports=app