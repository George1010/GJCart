var express=require('express')
var router = express.Router();
var path=require("path");
var Categories=require('../models/categories');

router.get('/',(req,res)=>{
    Categories.find((err,cat)=>{
        if(err){
            return console.log(err)
        }
        res.render('admin/categories',{
            categories:cat
        })
    })

});

router.get('/addcat',(req,res)=>{
    var title="";
    var slug="";
    res.render('admin/addcat.ejs',{
        title:title,
        slug:slug,
    });
})

router.post('/addcat',function (req,res){

    var t=req.body.title;
    var s=req.body.slug.replace(/\s+/g,'-').toLowerCase();

    console.log(t)
    console.log(s)
    if(t==""){
    res.render('admin/addcat.ejs',{
        title:t,
        slug:s,
    });
    }
    else{
   
        Categories.findOne({slug:s},(err,cat)=>{
            if(cat)
            {
  
                res.render('admin/addcat.ejs',{
                    title:t,
                    slug:s,
                });
            }
            else{
                var cat=new Categories({
                title:t,
                slug:s,
         
                });
             
                cat.save((err)=>
                {
                    Categories.find((err,cat)=>{
                        if(err)
                        console.log(err)
                        else
                        {
                            req.app.locals.categories=cat;
                        }
                    })
                    console.log(err)
                    res.redirect("/admin/cat");
                })
    
            }   
        })
    }
});


router.get('/editcat/:id',(req,res)=>{
    console.log(req.params.id)
    Categories.findOne({_id:req.params.id},(err,cat)=>{

        if(err){
            return console.log("Error")
        }
        else{
            res.render('admin/editcat.ejs',{
                title:cat.title,
                slug:cat.slug,
                id:cat._id
     
            });

        }
    })

})




router.post('/editcat/:id' ,(req,res)=>{

    var title=req.body.title;
    var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
    var id=req.body.id;
    console.log(title)
    console.log(slug)
        Categories.findOne({slug:slug,_id:{'$ne':id}},(err,cat)=>{
            if(err)
            {
  
                res.render('admin/editcat.ejs',{
                    title:title,
                    slug:slug,
             
                });
            }
            else{
                console.log("inside")
                console.log(id)
                Categories.findById(req.params.id,(err,cat)=>{
                    cat.title=title;
                    cat.slug=slug;
                 
                    cat.save((err)=>
                    {
                        Categories.find((err,cat)=>{
                        if(err)
                        console.log(err)
                        else
                        {
                            req.app.locals.categories=cat;
                        }
                    })
                        console.log(err)
                        res.redirect("/admin/cat");
                    })

                })

    
            }  
        })
    
});

router.get('/deletecat/:id',(req,res)=>{
    console.log(req.params.id)

    Categories.findByIdAndRemove(req.params.id,(err)=>{
        Categories.find((err,cat)=>{
            if(err)
            console.log(err)
            else
            {
                req.app.locals.categories=cat;
            }
        })
        if(err)
            return console.log(err)
            res.redirect('/admin/cat/');
    })
})


router.post('/reorder' ,(req, res) =>{
console.log(req.body)
});

module.exports=router;
