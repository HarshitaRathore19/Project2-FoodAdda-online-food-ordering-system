const mongoose = require('mongoose')
var schema = mongoose.Schema
const loginSchema = schema({
	userid:String,
	password:String
})
module.exports=mongoose.model('login',loginSchema)