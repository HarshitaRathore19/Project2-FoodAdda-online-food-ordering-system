const express = require ('express')
var router = express.Router()
router.get('/hello',(request,response)=>{
	response.send({'msg':"Hello REST API"})
})



const bodyparser = require('body-parser')
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({
	extended:true
}))




const mongoose = require('mongoose')
const login = require('../models/loginModel')
const fooddetail = require('../models/foodModel')
const order = require('../models/orderModel')
const cart = require('../models/addToCartModel')
const custdetail = require('../models/custSignupModel')
const url = "mongodb://localhost:27017/fooddb"
mongoose.connect(url)





router.post('/logincheck',(request,response)=>{
	var loginid = request.body.loginid
	var pass = request.body.password
	login.findOne({userid:loginid,password:pass},(err,result)=>{
		if (err) 
			response.send({"err":err})
		else
		{
			if (result!=null){
				//request.session.user = loginid;
				response.send({'user': 'login successfull'})
			}
			else
			{
				response.send({'msg':'Login failed, Incorrect id/password'})
			}
			    
		}
	})
})





router.post('/addproduct',(request,response)=>{
		              var fname = request.body.fname;
		              console.log(fname)
		              var categ = request.body.category;
	                  var price = request.body.price;
	                  var desc = request.body.desc;
                      const newfood = fooddetail({
                      				name: fname,
                      				category: categ,
                      				price: price,
                      				description: desc
                      			})
                      			newfood.save((err)=>{
                      				if (err)
                      					response.send({'err':err})
                      				else
                      					response.send({'msg':'Product added successfully'})
                      			}) 		
                      })
                  




router.get('/viewallpro',(request,response)=>{
	fooddetail.find({},(err,result)=>{
		if (err)
			response.send({"err":err})
			else
				response.send(result)
	})
})





router.delete('/deleteproduct',(request,response)=>{
	var id = request.query.id
	console.log(id)
	fooddetail.deleteOne({_id:id},(err,result)=>{
		if (err) 
			response.send({"err":err})
		else
		{
			response.send(result)
		}
	})
})




router.put('/updateproduct',(request,response)=>{
		  var id = request.body.id
		  var fname = request.body.fname;
		//  console.log(fname)
		  var categ = request.body.category;
	      var price = request.body.price;
	      var desc = request.body.desc;
         fooddetail.updateOne({name:fname},{category:categ,price:price,description:desc},(err)=>{
                 if (err)
                 response.send({"err":err})
                 else
                 response.send({'msg':'Product updated successfully'})     			
                      			}) 		
                      })



router.get('/pendingorderadmin',(request,response)=>{
	var status = 'Pending'
	order.aggregate(
		[ {
			$match:{status:status}
		},
		 {
		   $lookup:
		{
			from:"fooddetails",
			localField:"name",
			foreignField:"name",
			as:"data"
		}
	      }	
		],(err,result)=>{
			if (err)
				response.send({"err":err})
				else
					response.send(result)
})

})





router.get('/dispatch',(request,response)=>{
   var id = request.query.id
   var status = 'Dispatched'
 order.findByIdAndUpdate(id,{status:status},(err,result)=>{
	if (err) throw err
		else
			var status = 'Pending'
	order.aggregate(
		[ {
			$match:{status:status}
		},
		 {
		   $lookup:
		{
			from:"fooddetails",
			localField:"name",
			foreignField:"name",
			as:"data"
		}
	      }	
		],(err,result)=>{
			if (err)
				response.send({"err":err})
				else
					response.send(result)
})
         
	
		})


})




router.get('/orderhistoryadmin',(request,response)=>{
	var status = 'Dispatched'
			
			 order.aggregate(
				[ {
			$match:{status:status}
		},
				{
		   			$lookup:
					{
				    	from:"fooddetails",
						localField:"name",
						foreignField:"name",
						as:"data"
					}
	               }	
		        ],(err,result)=>{
			              if (err) 
			              	response.send({"err":err})
			                else
      response.send(result)
})
		            
})


router.get('/viewcustomeradmin',(request,response)=>{
	custdetail.find({},(err,result)=>{
		if (err)
			response.send({"err":err})
			else
				response.send(result)
	})

})



//-----------------------------------------------------------------------------------------

  
router.get('/',(request,response)=>{
	fooddetail.find({},(err,result)=>{
					if (err)
					response.send({"err":err})
						else
							response.send(result)
				})
})




router.post('/csignup',(request,response)=>{
	var name = request.body.cname;
	var contact = request.body.cnumber;
	var address = request.body.caddress;
	var email = request.body.cemailid;
	var password = request.body.cpassword;
	const newcust = custdetail({
		name: name,
		contact: contact,
		address: address,
		email:email,
		password:password
	})
    newcust.save((err)=>{
    	if (err)
    		response.send({"err":err})
    	else
    	response.send({'msg':'Account created successfully.........'})
    })
})
    



router.post('/custlogincheck',(request,response)=>{
	var userid = request.body.loginid
	var pass = request.body.password
	custdetail.findOne({email:userid,password:pass},(err,result)=>{
		if (err) throw err;
		else	
			if (result!=null){
				//request.session.customer = userid;
				var ipaddress = request.header('x-forwarded-for') || request.connection.remoteAddress;
				cart.update({cid:ipaddress},{cid:userid},(err,result)=>{
					if (err) throw err
						else
							console.log('view cart')
				})
				fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.send({'msg':'Login success'})
				})
				
			}
			else
				response.send({'msg':'Login failed, Incorrect id/password'})
		})
	})




router.post('/addtocart',(request,response)=>{
	
	var customer = request.body.cid
	var pname = request.body.pname
	var quantity = request.body.quantity
	var price = request.body.price
	cart.findOne({cid:customer,name:pname},(err,result)=>{
		console.log(result)
		if(result!=null)
		{
          var quant = parseInt(quantity)+parseInt(result.quantity)
          result.quantity=quant
          result.save()
		}
		else{
	const newcart = cart({
		    cid:customer,
            name: pname,
            quantity:quantity,
            price:price,
	})
	newcart.save((err)=>{
		if (err)
			response.send({"err":err})
		else
			response.send({'msg':'Product added to the cart'})
	})
}
})         
	
  
})




router.get('/viewcart',(request,response)=>{
	cart.aggregate(
		[
		{
			$match:{cid:cid}
		},
	{
		$lookup:
		{
			from:"fooddetails",
			localField:"name",
			foreignField:"name",
			as:"data"
		}
	}	
		],(err,result)=>{
			if (err) 
				response.send("err":err)
				else if(result.length!=0){									

		} else
		 response.render('viewCart',{product:result})

	})
		
})





module.exports = router