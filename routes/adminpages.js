var express=require('express')
var router = express.Router();
var path=require("path");
var Page=require('../models/page');

router.get('/',(req,res)=>{
   Page.find({}).sort({sorting:1}).exec((err,pages)=>{
       res.render('admin/page.ejs',{
           pages:pages
       })
   })
});

router.get('/addpages',(req,res)=>{
    var title="";
    var slug="";
    var content="";
    res.render('admin/addpage.ejs',{
        title:title,
        slug:slug,
        content:content
    });
})

router.post('/addpages',function (req,res){

    var t=req.body.title;
    var s=req.body.slug.replace(/\s+/g,'-').toLowerCase();
    var c=req.body.content;

    console.log(t)
    console.log(s)
    console.log(c)
    if(t==""){
    res.render('admin/addpage.ejs',{
        title:t,
        slug:s,
        content:c
    });
    }
    else{
   
        Page.findOne({slug:s},(err,page)=>{
            if(page)
            {
  
                res.render('admin/addpage.ejs',{
                    title:t,
                    slug:s,
                    content:c
                });
            }
            else{
                var page=new Page({
                title:t,
                slug:s,
                content:c,
                sorting:0
                });
             
                page.save((err)=>
                {
                    Page.find((err,pages)=>{
                        if(err)
                        console.log(err)
                        else
                        {
                            req.app.locals.pages=pages;
                        }
                    })
                    console.log(err)
                    res.redirect("/admin/pages");
                })
    
            }   
        })
    }
});


router.get('/edit-page/:id',(req,res)=>{
    console.log(req.params.id)
    Page.findOne({_id:req.params.id},(err,page)=>{

        if(err){
            return console.log("Error")
        }
        else{
            res.render('admin/edit-page.ejs',{
                title:page.title,
                slug:page.slug,
                content:page.content,
                id:page._id
            });

        }
    })

})




router.post('/edit-page/:id' ,(req,res)=>{

    var title=req.body.title;
    var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
    var content=req.body.content;
    var id=req.body.id;
    console.log(title)
    console.log(slug)
    console.log(content)
        Page.findOne({_id:{'$ne':id}},(err,page)=>{
            if(err)
            {
  
                res.render('admin/edit-page.ejs',{
                    title:title,
                    slug:slug,
                    content:content,
                    id:id
                });
            }
            else{
                console.log("inside")
                console.log(title)
                Page.findById(id,(err,page)=>{
                    page.title=title;
                    page.content=content;
                    page.slug=slug;
                 
                    page.save((err)=>
                    {
                        Page.find((err,pages)=>{
                            if(err)
                            console.log(err)
                            else
                            {
                                req.app.locals.pages=pages;
                            }
                        })
                        console.log(err)
                        res.redirect("/admin/pages");
                    })

                })

    
            }  
        })
    
});

router.get('/delete-page/:id',(req,res)=>{
    console.log(req.params.id)

    Page.findByIdAndRemove(req.params.id,(err,page)=>{
        Page.find((err,pages)=>{
            if(err)
            console.log(err)
            else
            {
                req.app.locals.pages=pages;
            }
        })
        if(err)
            return console.log(err)
            res.redirect('/admin/pages/');
    })
})


router.post('/reorder' ,(req, res) =>{
console.log(req.body)
});

module.exports=router;
