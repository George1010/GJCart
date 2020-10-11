var mongoose=require('mongoose')
var categories_schema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug : {
        type:String,
        required:true
    },


});


var categories=module.exports = mongoose.model('categories',categories_schema);