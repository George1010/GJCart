var mongoose=require('mongoose')
var pro_schema=mongoose.Schema({
    title:{
        type:String,
        },
    slug : {
            type:String,
            required:true
        },
    desc : {
        type:String,    


    },
    category:{
        type:String,    


    },
    price : {
        type:Number
    },
    image:{
        type: String

    }


});


var Product=module.exports = mongoose.model('Product',pro_schema);