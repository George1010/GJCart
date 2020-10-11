var mongoose=require('mongoose')
var cart_schema=mongoose.Schema({

    PersonId:{
        type:String
    },
    ObjectId:{
        type:String
    },

    qty:{
        type:Number,            
        required:true

    },


});


var Cart=module.exports = mongoose.model('Cart',cart_schema);