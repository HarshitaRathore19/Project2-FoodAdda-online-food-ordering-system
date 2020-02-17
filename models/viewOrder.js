const mongoose = require('mongoose')
var schema = mongoose.Schema
const orderSchema = schema({
	image:String
	name:String,
	quantity:Number,
	price:Number,
	total:Number,
	user:String,
	status:Number
})
module.exports=mongoose.model('order',orderSchema)