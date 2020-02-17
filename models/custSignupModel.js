const mongoose = require('mongoose')
var schema = mongoose.Schema
const custSchema = schema({
	name:String,
	contact:Number,
	address:String,
	email:String,
	password:String
})
module.exports=mongoose.model('custdetail',custSchema)