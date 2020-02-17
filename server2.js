const express = require('express')
const  app = express()
app.listen(1000,()=>{
	console.log("Server2 created on port number 1000")
})
 
const foodcontroller = require('./controller/foodController')
app.use('/api',foodcontroller)
