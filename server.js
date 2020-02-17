const express = require('express')
const  app = express()
app.listen(2000,()=>{
	console.log("Server created on port number 2000")
})

const upload = require('express-fileupload')
app.use(upload())

const session = require('express-session')
app.use(session({secret:'abc123'}))

const hbs = require('express-handlebars')
/*app.engine('hbs',hbs({
	extname: 'hbs',
	defaultLayout: 'commonLayout',
	layoutsDir: __dirname+'/views/layout/'
}))*/

const path = require('path')
app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')

const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
	extended:true
}))



var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'harshie.hr.111@gmail.com',
		pass: 'harshiehr'
	}
})





app.use(express.static(path.join(__dirname,'upload')));

const mongoose = require('mongoose')
const login = require('./models/loginModel')
const url = "mongodb://localhost:27017/fooddb"
mongoose.connect(url)

/*app.get('/loginpage',(request,response)=>{
	var userid = "harshitarathore1996@gmail.com";
	var password = "harshita"
	const newlogin = login({
		userid: userid,
		password: password
	})
    newlogin.save().then(data=>console.log("Data inserted"))
    response.render('login',{'msg':'Data inserted.........'})
})*/





//const login = require('./models/loginModel')
app.post('/signup',(request,response)=>{
	var uid = request.body.eid;
	var password = request.body.password;
	const newlogin = login({
		userid:uid,
		password:password
	})
    newlogin.save().then(data=>console.log("Account created successfully"))
    response.render('signup',{'msg':'Account created successfully.........'})
})










app.get('/admin',(request,response)=>{
	//console.log(request.session.user)
	response.render('login')
})

app.post('/logincheck',(request,response)=>{
	var loginid = request.body.loginid
	var pass = request.body.password
	login.findOne({userid:loginid,password:pass},(err,result)=>{
		if (err) throw err;
		else
		{
			if (result!=null){
				request.session.user = loginid;
				response.render('home',{user: request.session.user})
			}
			else
			{
				response.render('login',{'msg':'Login failed, Incorrect id/password'})
			}
			    
		}
	})
})


app.get('/home',(request,response)=>{
	if(request.session.user===undefined)
		response.render('login')
	else
	response.render('home',{user: request.session.user})
})


app.get('/addnewpro',(request,response)=>{
	response.render('addNewPro',{user: request.session.user})
})




const fooddetail = require('./models/foodModel')
app.post('/addproduct',(request,response)=>{
	//console.log(request.files)
	if(request.files){
		              var name = request.body.fname;
		              var categ = request.body.fcategory;
	                  var price = request.body.fprice;
	                  var desc = request.body.fdesc;
	                  var file = request.files.file;
                      var filename = file.name;
                       console.log(name)
                      file.mv('./upload/'+filename,(err)=>{
                      	if (err) throw err
                      		else{
                      			const newfood = fooddetail({
                      				name: name,
                      				category: categ,
                      				price: price,
                      				description: desc,
                      				imagename: filename
                      			})
                      			newfood.save().then(data=>console.log("product added"))
                                response.render('addNewPro',{user: request.session.user,'msg':'Product added and image uploaded successfully'})
                      		}
                      })
                  }
})


app.get('/viewallpro',(request,response)=>{
	fooddetail.find({},(err,result)=>{
		if (err) throw err
			else
				response.render('viewAllPro',{'products':result,user: request.session.user})
	})
})


app.get('/deleteproduct',(request,response)=>{
	var id = request.query.id
	console.log(id)
	fooddetail.deleteOne({_id:id},(err)=>{
		if (err) throw err
		else
		{
			fooddetail.find({},(err,result)=>{
				if(err) throw err
					else{
						response.render('viewAllPro',{user: request.session.user, 'products':result,'msg':'Data deleted....'})
					}
			})
		}
	})
})



app.get('/updateproduct',(request,response)=>{
	var id = request.query.id
	fooddetail.findOne({_id:id},(err,result)=>{
		if (err) throw err
			else{
				console.log(result)
				response.render('updatePro',{user: request.session.user, 'product':result})
			}
	})
})



app.post('/updatepro',(request,response)=>{
	if(request.files)
	{
		var id = request.body.id
	var name = request.body.fname
	var categ = request.body.fcategory
	var price = request.body.fprice
	var desc = request.body.fdesc
	var file = request.files.file;
    var filename = file.name;
    file.mv('./upload/'+filename,(err)=>{
    	if (err) throw err
    		else{
    			fooddetail.findByIdAndUpdate(id,{name:name,category:categ,price:price,description:desc,imagename:filename},(err)=>{
					if (err) throw err
					else{
				fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('updatePro',{ user: request.session.user, 'product':result,'msg':'Data updated successfully....'})
					})
						}
	})

    			}
    })
	}
	else{
	var id = request.body.id
	var name = request.body.fname
	var categ = request.body.fcategory
	var price = request.body.fprice
	var desc = request.body.fdesc
	//var file = request.files.file;
    //var filename = file.name;
   
fooddetail.findByIdAndUpdate(id,{name:name,category:categ,price:price,description:desc},(err)=>{
		if (err) throw err
			else{
				fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('updatePro',{user: request.session.user, 'product':result,'msg':'Data updated successfully....'})
				})
			}
	})
		}	

})

app.get('/signupform',(request,response)=>{
	response.render('signup')
})


app.get('/Checkuserid',(request,response)=>{
var userid=request.query.uid;
login.findOne({userid},(err,result)=>{
if(err) throw err;
else if(result!=null)
response.send({'msg':'Already Exist'})
else
response.send({'msg':'Available'})
})
})


app.get('/Checkdishname',(request,response)=>{
var name=request.query.name;
fooddetail.findOne({name},(err,result)=>{
if(err) throw err;
else if(result!=null)
response.send({'msg1':'Already Exist'})
else
response.send({'msg1':'Available'})
})
})


app.get('/adminlogout',(request,response)=>{
	request.session.destroy()
	response.render('login')
})





app.get('/pendingorderadmin',(request,response)=>{
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
			if (err) throw err
				else
					response.render('pendingOrderAdmin',{orders:result,user: request.session.user})
})

})


app.get('/dispatch',(request,response)=>{
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
			if (err) throw err
				else
					response.render('pendingOrderAdmin',{orders:result,user: request.session.user,'msg':'Order dispatched succefully'})
})
         //response.render('pendingOrderAdmin',{orders:result,user: request.session.user,'msg':'Order dispatched succefully'})
	
		})


})






app.get('/orderhistoryadmin',(request,response)=>{
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
			              if (err) throw err
			                else
      response.render('orderHistoryAdmin',{orders:result,user: request.session.user})
})
							
			            

})




app.get('/viewcustomeradmin',(request,response)=>{
	custdetail.find({},(err,result)=>{
		if (err) throw err
			else
				response.render('viewAllCustomers',{'customer':result,user: request.session.user})
	})

})




app.get('/changepassadmin',(request,response)=>{
	response.render('changePassAdmin',{user:request.session.user})
})

app.post('/changepassa',(request,response)=>{
	var user = request.session.user
	var id = request.query.id
	var loginid = request.body.loginid
	var cpass = request.body.cpass
	var npass = request.body.npass
	login.findOneAndUpdate({userid:loginid},{password:npass},(err)=>{
         if (err) throw err
         	else
         	{
         	  response.render('changePassAdmin',{user:request.session.user,'msg':'Password changed successfully'})
         	}
	})
})


app.use(function(request,response,next){
	response.set('Cache-Control','no-cache,private,no-store,must revalidate,max-state=0,past-check=0,pre-check=0')
    next()	
})







//================================================//=============================================


app.get('/',(request,response)=>{
	fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('index',{'product':result})
				})
})


app.get('/custsignup',(request,response)=>{
	response.render('custsignup')
})


app.get('/custhome',(request,response)=>{
	fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('index',{'product':result,customer:request.session.customer})
				})

})




const custdetail = require('./models/custSignupModel')
app.post('/csignup',(request,response)=>{
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
    newcust.save().then(data=>console.log("Account created successfully"))
    response.render('custsignup',{'msg':'Account created successfully.........'})
})



app.get('/custlogin',(request,response)=>{
	response.render('custlogin')
})



app.post('/custlogincheck',(request,response)=>{
	var userid = request.body.loginid
	var pass = request.body.password
	custdetail.findOne({email:userid,password:pass},(err,result)=>{
		if (err) throw err;
		else	
			if (result!=null){
				request.session.customer = userid;
				var ipaddress = request.header('x-forwarded-for') || request.connection.remoteAddress;
				cart.update({cid:ipaddress},{cid:userid},(err,result)=>{
					if (err) throw err
						else
							console.log('view cart')
				})
				fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('index',{'product':result,customer: request.session.customer})
				})
				
			}
			else
				response.render('custlogin',{'msg':'Login failed, Incorrect id/password'})
		})
	})
//})



const cart = require('./models/addToCartModel')
app.post('/addtocart',(request,response)=>{
	if(request.session.customer===undefined)
	{
		var ipaddress = request.header('x-forwarded-for') || request.connection.remoteAddress;
        var cid = ipaddress
	}
	else
	{
         var cid = request.session.customer
	}
	
	var customer = cid
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
	newcart.save().then(data=>console.log("Add to cart"))
}
})
	fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('index',{'product':result,customer: request.session.customer,'msg':'Product successfully added to cart.........'})
				})
	         
	
  
})

app.get('/viewcart',(request,response)=>{
	if(request.session.customer===undefined)
	{
		var ipaddress = request.header('x-forwarded-for') || request.connection.remoteAddress;
        var cid = ipaddress
	}
	else
	{
         var cid = request.session.customer
	}
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
			if (err) throw err
				else if(result.length!=0){
					
				//console.log(result)
				

		var cartData=result;
var fprice=result.map((rec)=>{
var fpri=(rec.price*rec.quantity)
 return fpri
 })		    
//console.log(fprice)

var finaldata=cartData.map((rec,index)=>{
var pair={fprice:fprice[index]}
obj={...rec,...pair};
return obj;
})

var Gtotal=fprice.reduce((price,num)=>{return price+num})

			response.render('viewCart',{product:finaldata,gtotal:Gtotal,customer: request.session.customer})
		} else
		 response.render('viewCart',{product:result})

	})
		
})


app.get('/deletecart',(request,response)=>{
	var name = request.query.name
	console.log(name)
	cart.deleteOne({name:name},(err)=>{
		if (err) throw err
		else
		{
			fooddetail.find({},(err,result)=>{
				if(err) throw err
					else{
						//response.render('viewCart',{user: request.session.customer, 'products':result,'msg':'Data deleted....'})
						cart.aggregate(
		[
		{
			$match:{cid:request.session.customer}
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
			if (err) throw err
			//console.log(result)

		var cartData=result;
var fprice=result.map((rec)=>{
var fpri=(rec.price*rec.quantity)
 return fpri
 })		    
//console.log(fprice)

var finaldata=cartData.map((rec,index)=>{
var pair={fprice:fprice[index]}
obj={...rec,...pair};
return obj;
})

var Gtotal=fprice.reduce((price,num)=>{return price+num})

			response.render('viewCart',{product:finaldata,gtotal:Gtotal,customer: request.session.customer,'msg':'Item deleted from cart....'})
		}) //{user: request.session.customer, 'products':result,'msg':'Data deleted....'}
					}
			})
		}
	})
})



app.post('/paymentaction',(request,response)=>{
	var address = request.body.address
	var totalamnt = request.body.total
	response.render('payment',{customer:request.session.customer,address:address,tamnt:totalamnt})
})



const stripe = require('stripe')('sk_test_sJW9ymqXEzd5uBRbsWQKoUsy003Al6VG3j')


app.post('/pay',(request,response)=>{
var token=request.body.stripeToken;
var chargeamt=request.body.amount;
var address = request.body.address
var charge=stripe.charges.create({
amount:chargeamt,
currency:"inr",
source:token
},(err,result)=>{
if(err) throw err
else{
       // console.log("Card Decliend");
    
response.redirect('/checkout?add='+address);
}
});
});





const order = require('./models/orderModel')
app.get('/checkout',(request,response)=>{
   var customer = request.session.customer
   var orderid =  request.query.id
    cart.aggregate(
		[
		{
			$match:{cid:request.session.customer}
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
			console.log(result)
var carts =result.map((d)=>{
console.log(d.name)
console.log(d.price)
console.log(d.quantity)

	var name = d.name
	var quantity = d.quantity
	var price = d.price
	var total = (d.quantity*d.price)
	var user = d.cid
	var address = request.query.add
	var status= 'Pending'
	var date = request.query.time
	const neworder = order({
			name:name,
			quantity:quantity,
			price:price,
			total:total,
			user:user,
			address:address,
			status:status,
			date:date
         })
	neworder.save().then(data=>console.log("Data inserted"))
    //response.render('viewCart',{customer: request.session.customer,'msg':'Order placed successfully'})
})
cart.remove({cid:customer},(err)=>{
      if (err) throw err
      	else
      		console.log('Data deleted....')

      	response.render('viewCart',{customer: request.session.customer,'msg':'Order placed successfully'})
})

var mailoptions = {
	from : 'harshie.hr.111@gmail.com',
	to : customer,
	subject : 'Food Adda order confirmation mail',
	text : 'Hello '+customer+ ' we have successfully received your order with order id '+orderid+ ' . You will receive your order within 30 mins.'
}
transporter.sendMail(mailoptions,function(err,info){
	if (err) throw err
		else
			console.log('Mail send successfully...')
})
})
})





app.get('/viewordercust',(request,response)=>{
	userid = request.session.customer
	 order.aggregate(
				[ {
			$match:{user:userid}
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
			              if (err) throw err
			                else
			                {
			                	console.log(result)
      response.render('viewOrderCust',{order:result,customer: request.session.customer})
       }
})
	})



app.get('/changepasscust',(request,response)=>{
	response.render('changePassCust',{customer:request.session.customer})
})

app.post('/changepassc',(request,response)=>{
	var customer = request.session.customer
	var id = request.query.id
	var loginid = request.body.loginid
	var cpass = request.body.cpass
	var npass = request.body.npass
	custdetail.findOneAndUpdate({email:loginid},{password:npass},(err)=>{
         if (err) throw err
         	else
         	{
         	  response.render('changePassCust',{customer:request.session.customer,'msg':'Password changed successfully'})
         	}
	})
})





app.get('/custlogout',(request,response)=>{
	request.session.destroy()
	fooddetail.find({},(err,result)=>{
					if (err) throw err
						else
							response.render('index',{'product':result})
				})
})









