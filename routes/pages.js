var express=require('express')
var router = express.Router();
var path=require("path");
var sess
var Page=require('../models/page.js')

router.get('/',(req,res)=>{
    var slug=req.params.slug;
    console.log("in page")     
    console.log(req.app.locals.name)

    Page.findOne({slug:'home'},(err,page)=>{
        if(err)
        {
            console.log(err)
        }

        else
        {
            res.render('gj.ejs',{
                title: page.title,
                content:page.content,
            });
        }
    })

});
router.get('/:slug',(req,res)=>{
    var slug=req.params.slug;
    Page.findOne({slug:slug},(err,page)=>{
        if(err)
        {
            console.log(err)
        }
        if(!page)
        {
            res.redirect('/')
        }
        else
        {
            res.render('gj.ejs',{
                title: page.title,
                content:page.content,

            });
        }
    })

});
module.exports=router;