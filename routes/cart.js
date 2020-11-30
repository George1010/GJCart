var express=require('express')
var router = express.Router();
var path=require("path");

const checksum_lib = require('../paytm/checksum/checksum')

var Cart=require('../models/cartm.js');
var Order=require('../models/order.js');
const product = require('../models/product.js');
var Product=require('../models/product.js')
var User=require('../models/user.js')

router.get('/add/:product',(req,res)=>{
    Cart.count({PersonId:req.app.locals.id},(err,rs)=>{
        if(err)
        console.log(err)
        else
        {
            
            req.app.locals.cart=rs;
        }
    })
    var pro=req.params.product;
    console.log(req.app.locals.id)

    User.findById({_id:req.app.locals.id},(err,u)=>{
        if(u){
            console.log("user found")

        Product.findOne({slug:pro},(err,p)=>{
            if(p){
            Cart.findOne({PersonId:u._id,ObjectId:p._id},(err,c)=>{
                console.log(p._id)
                if(err)
                {
                    console.log(err);
                }
                if(c)
                {
                   console.log("present")
                  c.qty++;
                  c.save((err)=>{
                      if(err)
                      {
                          console.log(err);
                      }

                  })
                }
               else
               {
                    console.log("Save")

                    var c=new Cart({
                        PersonId:req.app.locals.id,
                        ObjectId:p._id,
                        qty:1,
                    })
                    c.save((err)=>{
                        if(err){
                            console.log(err);
    
                        }

                    })

                    
                }


                var po=p.category;
                Cart.find((err,c)=>{
                    if(err)
                    console.log(err)
                    else
                    {
                        
                        req.app.locals.carts=c;
                    }
                })

                res.redirect('/products/'+po+'/'+pro)

            })
        }
        else
        {

            res.redirect('/')
        }
        })
    }

    })


})

router.get('/checkout',(req,res)=>{
    User.find((err,p)=>{

   product.find((err,pr)=>{
    Cart.find((err,cart)=>{

        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('checkout.ejs',{
                carts:cart,
                product:pr,
                user:p
            })
        }

    })
})
})

})

router.get('/:id/:product/increase',(req,res)=>{
    var id=req.app.locals.id;
    var obj_id=req.params.product;
    Cart.findOne({PersonId:id,ObjectId:obj_id},(err,p)=>{
        if(err)
        {
            console.log(err);
        }
        if(p)
        {
            p.qty++
            p.save((err)=>{
                if(err)
                {
                    console.log(err)
                }
                else{
                    Cart.find((err,c)=>{
                        if(err)
                        console.log(err)
                        else
                        {
                            
                            req.app.locals.carts=c;
                        }
                    })

                    res.redirect('/cart/checkout');
                }
            })
        }


    })
})
router.get('/:id/:product/reduce',(req,res)=>{
    var id=req.app.locals.id;
    var obj_id=req.params.product;
        Cart.findOne({PersonId:id,ObjectId:obj_id},(err,p)=>{
        if(err)
        {
            console.log(err);
        }
        if(p.qty>1)
        {
            p.qty--
            p.save((err)=>{
                if(err)
                {
                    console.log(err)
                }
                else{
                    Cart.find((err,c)=>{
                        if(err)
                        console.log(err)
                        else
                        {
                            
                            req.app.locals.carts=c;
                        }
                    })

                    res.redirect('/cart/checkout');
                }
            })
        }
        else
        {
            p.remove((err)=>{
                if(err){
                    console.log(err);
                }
            })
            Cart.find((err,c)=>{
                if(err)
                console.log(err)
                else
                {
                    
                    req.app.locals.carts=c;
                }
            })

            res.redirect('/cart/checkout');
        }
        

    })
})

router.get('/order/cancel/:orderID',(req,res)=>{
        var orderID=req.params.orderID;
        Order.findByIdAndDelete({_id:orderID},(err,order)=>{
            if(err){
                console.log(err)
            }
            res.redirect('/profile/'+req.app.locals.id)
        })
})

    
router.get('/order/:cartID',(req,res)=>{
     var cartid=req.params.cartID
     console.log(cartid)
     Cart.findOne({_id:cartid},(err,cart)=>{
         if(cart){
             console.log("in")
        Product.findOne({_id:cart.ObjectId},(err,product)=>{
            if(product){
             console.log("in")

            User.findOne({_id:cart.PersonId},(err,user)=>{
                if(user){
             console.log("in")

                Order.findOne({cartid:cart._id},(err,o)=>{
                    if(err){
                        console.log(err)
                    }
                    if(o)
                    {
                        res.redirect('/cart/checkout')
                    }
                    else{
                        var order=new Order({               
                            cartid:cart._id,
                            pid:product._id,
                            uid:user._id,
                            qty:cart.qty,
                            payment:"Pending"
                        })
                        order.save((err)={
                            if(err)
                            {
                                console.log(err)
                            }

                        })
                        Cart.findByIdAndRemove({_id:cartid},(err,cart)=>{
                            if(err)
                                console.log(err)
                        });
                        
                        res.redirect('/cart/checkout/')

                    }
                })
                }
            })
        }
        })
    }
     })
     
})
/*
router.get('/add/:product',(req,res)=>{

    var slug=req.params.product;
    Product.findOne({slug:slug},(err,p)=>{
        if(err)
        {
            console.log(err)
        }
        req.session.cart=[];
        if(typeof req.session.cart=="undefined")
        {
            console.log("1");
            req.session.cart=[]
            req.session.cart.push({
                title:p.slug,
                qty:1,
                price:parseFloat(p.price).toFixed(2),
                image:'product_images/'+p._id+'/'+p.image
            })
            req.session.save()

        }
        else{
            console.log("2");

            var cart=req.session.cart;
            var newItem=true
            for(var i=0;i<cart.length;i++)
            {
                if(cart[i].title==p.slug)
                {
                    cart[i].qty++;
                    newItem=false;
                    break;
                }

            }
            if(newItem)
            {
                req.session.cart.push({
                    title:p.slug,
                    qty:1,
                    price:parseFloat(p.price).toFixed(2),
                    image:'product_images/'+p._id+'/'+p.image
                })
            }



       }
       req.session.save((err)=>{
        if(err)
        {
            console.log(err);
        }

    })
       console.log(req.session.cart)
       console.log(cart.length)
       res.redirect('/products');

    })

});
*/
module.exports=router;