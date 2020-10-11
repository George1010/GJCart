var express=require('express')
var router = express.Router();
var path=require("path");
const mkdirp=require('mkdirp')
var fs=require('fs-extra')
var rs=require('resize-img')
var Product=require('../models/product');
var Category=require('../models/categories');
var multer = require('multer');

router.get('/',(req,res)=>{
    var count;
    Product.count((err,c)=>{
        count=c
    })
    Product.find((err,pro)=>{
        res.render('admin/products',{
            products:pro,
            count:count
        })
    })

});

router.get('/addproduct',(req,res)=>{
    var title="";
    var desc="";
    var price="";
    var s=""
    Category.find((err,categories)=>{
        res.render('admin/addproduct.ejs',{
            title:title,
            slug:s,
            desc: desc,
            price:price,
            categories:categories
        });
    })

})
var Storage=multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
var upload=multer({
    storage:Storage

})

router.post('/addproduct',upload.single('image'),(req,res)=>{
    var imageFile=req.file.originalname;

    var t=req.body.title;
    var s=req.body.slug;
    var desc=req.body.content;
    var price = req.body.price;
    var category = req.body.Category;

    //console.log(req.files.image.name)
    if(t==""){
        Category.find((err,categories)=>{
            res.render('admin/addproduct.ejs',{
                title:t,
                desc: desc,
                slug:s,
                price:price,
                categories:categories
            });
        })
    }
    else{
   
        Product.findOne({slug:s},(err,pro)=>{
            if(pro)
            {
                Category.find((err,categories)=>{
                    res.render('admin/addproduct.ejs',{
                        title:t,
                        desc: desc,
                        slug:s,
                        price:price,
                        categories:categories,
                        image:imageFile         

                    });
                })
            }
            else{
                var price2=parseFloat(price).toFixed(2);
                var pro=new Product({
                    title:t,
                    desc: desc,
                    slug:s,
                    price:price2,
                    category:category,
                    image:imageFile         

                });

                pro.save((err)=>
                {
                    console.log(__dirname)

                    fs.mkdir(process.cwd()+'/public/product_images/'+pro._id+'/gallery',{ recursive: true },(err)=>{
                        return console.log(err)
                    })
                    fs.mkdir(process.cwd()+'/public/product_images/'+pro._id+'/gallery/thumbs',{ recursive: true },(err)=>{

                        return console.log(err)
                    })
                    var old=process.cwd()+'/public/uploads/'+req.file.originalname;
                    console.log(old)
                    var path=process.cwd()+'/public/product_images/'+pro._id+'/'+req.file.originalname;
                    fs.move(old,path,(err)=>{
                        if(err){
                            console.log(err)
                        }
       
                        console.log("Done");

                    })

                    res.redirect("/admin/products/")
                })
    
            }   
        })
    }
});


router.get('/editproduct/:id',(req,res)=>{
    console.log(req.params.id)
    Category.find((err,categories)=>{
    Product.findOne({_id:req.params.id},(err,pro)=>{

        if(err){
            return console.log("Error")
        }
        else{
            var gallerydir="public/product_images/"+pro._id+"/gallery/thumbs";
            var galleryImages=null;
            fs.readdir(gallerydir,(err,file)=>{
                if(err)
                {
                    console.log(err)
                }
                else{
                    galleryImages=file;
                    res.render('admin/editpro.ejs',{
                        title:pro.title,
                        desc:pro.desc,
                        slug:pro.slug,
                        id:pro._id,
                        price:pro.price,
                        categories:categories,
                        image:pro.image,
                        category:pro.category.toLowerCase(),
                        galleryImages:galleryImages
                        
             
                    });
                }
            })
        
        }
    })

})
})

router.post('/editproduct/:id',upload.single('image'), function (req, res) {

    var imageFile = typeof req.file !== "undefined" ? req.file.originalname : "";


        var title = req.body.title;
        var s= req.body.slug;
        var desc = req.body.desc;
        var price = req.body.price;
        var category = req.body.category;
        var pimage = req.body.pimage;
        var id = req.params.id;
        console.log(id)
        console.log(desc)
        console.log(price)
        console.log(category)
        console.log(s)

        console.log(pimage)
        Product.findOne({ _id: {'$ne': id}}, function (err, p) {
            if (err)
                console.log(err);

           /* if (p) {
                res.redirect('/admin/products/editproduct/' + id);
            } else {*/
                Product.findById(id, function (err, p) {
                    if (err)
                        console.log(err);

                    p.title = title;
                    p.slug=s;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if (imageFile != "") {
                        p.image = imageFile;
                    }

                    p.save(function (err) {
                        if (err)
                            console.log(err);

                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, function (err) {
                                    if (err)
                                        console.log(err);
                                });
                            }
                            var thumb=process.cwd()+'/public/product_images/'+p._id+'/gallery/thumbs';

                            var old=process.cwd()+'/public/uploads/'+req.file.originalname;
                            console.log(old)
                            var path=process.cwd()+'/public/product_images/'+p._id+'/'+req.file.originalname;
                            fs.move(old,path,(err)=>{
                                if(err){
                                    console.log(err)
                                }
                         
                                console.log("Done");
        
                            })

                        }

                        res.redirect('/admin/products/editproduct/' + id);
                    });

                });
            //}
        });
    

});



router.post('/product_gallery/:id',upload.array("file", 10),(req,res)=>{
    console.log("CAme IN")
    var id=req.params.id
    var files =  req.files;
     if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log(file.originalname)
                    var path=process.cwd()+'/public/uploads/'+file.originalname;
                    var gal=process.cwd()+'/public/product_images/'+id+'/'+'gallery/'+file.originalname;

                    var thumb=process.cwd()+'/public/product_images/'+id+'/'+'gallery/'+'thumbs/'+file.originalname;
                    fs.move(path,gal,(err)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            rs(fs.readFileSync(gal),{width:100,height:100}).then((buf)=>{
                                fs.writeFileSync(thumb,buf)
                            })
                        }
                        console.log("Done");
                    });
                }
            }

    res.sendStatus(200);
})

/*
router.post('/editproduct/:id',upload, function (req, res) {

    var imageFile = typeof req.file !== "undefined" ? req.file.originalname : "";

    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;
    Product.findOne({_id: {'$ne': id}}, function (err, p) 
    {
            if (err)
                console.log(err);

            if (p) {
                res.redirect('/admin/products/editproduct/' + id);
            } else {
                Product.findById(id, function (err, p) {
                    if (err)
                        console.log(err);

                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if (imageFile != "") {
                        p.image = imageFile;
                    }

                    p.save(function (err) {
                        if (err)
                            console.log(err);

                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, function (err) {
                                    if (err)
                                        console.log(err);
                                });
                            }

                            var productImage = req.file;
                            var path = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(path, function (err) {
                                return console.log(err);
                            });

                        }

                        res.redirect('/admin/products/editproduct/' + id);
                    });

                });
            }
        });
    

});*/

router.get('/deleteproduct/:id',(req,res)=>{
    console.log(req.params.id)

    Product.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
            return console.log(err)
            res.redirect('/admin/products/');
    })
})

router.get('/deleteimage/:image',(req,res)=>{
    var org=process.cwd()+'/public/product_images/'+req.query.id+'/'+'gallery/'+req.params.image;
    var thumb=process.cwd()+'/public/product_images/'+req.query.id+'/'+'gallery/'+'thumbs/'+req.params.image;
    fs.remove(org,(err)=>{
        if(err)
        console.log(err)
        else{
            fs.remove(thumb,(err)=>{
                if(err)
                console.log(err)
                else
                {
                    res.redirect('/admin/products/editproduct/'+req.query.id)
                }
            })
        }
    })
    

})

module.exports=router;
