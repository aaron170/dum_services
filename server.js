var express = require('express');
var jsonfile = require('jsonfile');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
app.use(session({
    secret : "SHUUUUSH",
    saveUninitialized: true,
    resave : false
}))

var port = process.env.PORT || 3009; 

//routing
app.use('/js',  express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/css', express.static(__dirname + '/app/assets'));
app.use(express.static(__dirname + '/app'));


var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Max-Age', '3600');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Custom-Header');
		res.status(200);
		res.json({"message":"cors ok"});
    }
    else {
    	res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Max-Age', '3600');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Custom-Header');
      	next();
    }
};

app.use(allowCrossDomain);


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json 
app.use(bodyParser.json())

var router = express.Router(); 

router.route('/').get(function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/chat/:token').get(function(req, res){

	console.log(req.params);
	res.sendFile('app/views/chat.html' , { root : __dirname});
});

router.route('/api/:service').put(function(req, res) {
	console.log("call => PUT/api/"+ req.params.service, " | request body => ", req.body);
	
	if(req.body){
		var file = './service_json/'+req.params.service+'.json';
		fs.exists(file, function(exists) {
			if (exists) {
				var write_obj = req.body;
				jsonfile.writeFile(file, write_obj, function (err) {
					if(err){
						res.status(406);
						res.json({ message: 'hooray! welcome to our api!' });
					}else{
						res.status(201);
						res.json({ "api" : "http://10.2.2.56:"+port+"/api/"+req.params.service, "method" : "GET" });
					}
				});		
			} else {
				res.status(401);
				res.json({ message: req.params.service+' : service is not exist!' });
			}
		});
	} else{
		res.status(304);
		res.json({message: 'Request Body not accepted!'});
	}

});

router.route('/api/:service').post(function(req, res) {
	console.log("call => POST/api/"+ req.params.service, " | request body => ", req.body);

	if(req.body){
		var file = './service_json/'+req.params.service+'.json';
		fs.exists(file, function(exists) {
			if (exists) {
				res.status(401);
				res.json({ message: req.params.service+' : service is already exist!' });			
			} else {
				var write_obj = req.body;
				jsonfile.writeFile(file, write_obj, function (err) {
					if(err){
						res.status(406);
						res.json({ message: 'hooray! welcome to our api!' });
					}else{
						res.status(201);
						res.json({ "api" : "http://10.2.2.56:"+port+"/api/"+req.params.service, "method" : "GET" });
					}
				});
			}
		}); 
	} else{
		res.status(304);
		res.json({message: 'Request Body not accepted!'});
	}
});

router.route('/api/:service').get(function(req, res) {
	console.log("call => GET/api/"+ req.params.service);
	var file = './service_json/'+req.params.service+'.json';
	var jsonObj = jsonfile.readFileSync(file);
	res.status(200);
    res.json(jsonObj);   
});

router.route('/login').post(function(req, res){
	console.log(req);
	//res.end(JSON.stringify(req.body, null, 2));
	req.session.user = req.body;
	res.end(JSON.stringify(req.session, null, 2));
});

app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);