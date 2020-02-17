const mongoose = require('mongoose')
var schema = mongoose.Schema
const foodSchema = schema({
	name:String,
	category:String,
	price:Number,
	description:String,
	imagename:String
})
module.exports=mongoose.model('fooddetail',foodSchema)