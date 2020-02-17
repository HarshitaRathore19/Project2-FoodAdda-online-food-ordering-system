const mongoose = require('mongoose')
var schema = mongoose.Schema
const orderSchema = schema({
	name:String,
	quantity:Number,
	price:Number,
	total:Number,
	user:String,
	address:String,
	status:String,
	time:Date
})
module.exports=mongoose.model('order',orderSchema)