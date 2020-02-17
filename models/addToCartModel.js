const mongoose = require('mongoose')
var schema = mongoose.Schema
const atcSchema = schema({
	cid: String,
	name:String,
	quantity:Number,
	price:Number
})
module.exports=mongoose.model('cart',atcSchema)