var mongoose=require('mongoose')
var page_schema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug : {
        type:String,
        required:true
    },
    content : {
        type:String,    


    },
    sorting : {
        type:Number
    }

});


var Page=module.exports = mongoose.model('Page',page_schema);