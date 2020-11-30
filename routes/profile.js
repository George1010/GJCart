var express=require('express')
var router = express.Router();
var path=require("path");
var User=require('../models/user');
var Order=require('../models/order.js');
var product = require('../models/product');
var Cart = require('../models/cartm');

router.get('/:user',(req,res)=>{

    User.findOne({username: req.app.locals.userid}, function (err, user) {
        Order.find({uid:user._id},(err,order)=>{
            console.log(order.pid)
 
        if (err)
            console.log(err);
            Cart.find({PersonId:user._id},(err,cart)=>{
                product.find({},(err,product)=>{
                        res.render("profile.ejs",{
                            user:user,
                            order:order,
                            product:product,
                            Cart:cart
                        });
                    })
        })
        });
    
})
});






router.get('/:user/change',(req,res)=>{
    User.findOne({username: req.app.locals.userid}, function (err, user) {
        if (err)
            console.log(err);

            res.render("profilechange.ejs",{
                user:user
            });
        });

});
router.post('/:user/change',(req,res)=>{
    var name=req.body.name
    var email=req.body.email
    var mobile=req.body.mob
    var userid=req.body.userid
    var address=req.body.address
    User.findOne({username: req.app.locals.userid}, function (err, user) {
        if (err)
            console.log(err);
        user.name=name
        user.email=email
        user.username=userid
        user.address=address
        user.save((err)=>{
            if(err)
            {
                console.log(err)
            }
            res.redirect("/profile/userid")
        })


        });

});
module.exports = router;
