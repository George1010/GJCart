var express=require('express')
var router = express.Router();
var path=require("path");
var fs=require('fs');
var Product=require('../models/product.js')
var Category=require('../models/categories.js')
var Cart=require('../models/cartm.js');

router.get('/',(req,res)=>{
    Product.find((err,pro)=>{
        if(err)
        {
            console.log(err)
        }

        else
        {
            res.render('all_products.ejs',{
                title: 'All Products',
                products:pro
            });
        }
    })

});
router.get('/:category',(req,res)=>{
    var cat=req.params.category;

    Product.find({category:cat},(err,pro)=>{
        if(err)
        {
            console.log(err)
        }

        else
        {
            res.render('cat_products.ejs',{
                title: cat,
                products:pro
            });
        }
    })

});


router.get('/:category/:slug',(req,res)=>{
    var gallimg=null;
    Cart.count({PersonId:req.app.locals.id},(err,rs)=>{
        if(err)
        console.log(err)
        else
        {
            
            req.app.locals.cart=rs;
        }
    })
    console.log(req.params.slug)
    Product.findOne({slug:req.params.slug},(err,pro)=>{
        if(err)
        {
            console.log(err)
        }

        else
        {
            var galldir="public/product_images/"+pro._id+"/gallery";
            fs.readdir(galldir,(err,files)=>{
                if(err){
                    console.log(err);
                }
                else{
                    gallimg=files;
                        res.render('products.ejs',{
                        title: pro.title,
                        galleryImages:gallimg,
                        p:pro
                    });
                }
            })

        }
    })

});
module.exports=router;