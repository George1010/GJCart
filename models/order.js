var mongoose=require('mongoose')
var order_schema=mongoose.Schema({
    cartid:{
        type:String,
        required:true
    },
    pid:{
        type:String,
        required:true
    },
    uid:{
        type:String,
        requied:true
    },
    qty:{
        type:Number,
        requried:true
    },
    payment:{
        type:String,
        required:true
    }
});


var Order=module.exports = mongoose.model('Order',order_schema);