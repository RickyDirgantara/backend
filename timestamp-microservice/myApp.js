let express = require('express');
let app = express();

// task 1
// app.get('/', function(req, res) {
// 	res.send("Hello Express");
// })
// console.log("Hello World")

// task 2 
app.get('/', function(req, res) {
	let path = __dirname + "/views/index.html"
	res.sendFile(path)
})
let path = __dirname + "/public";
app.use("/public", express.static(path))

// task 3
 //var helloObj = {"message": "Hello json"};
 //app.get('/json', function(req, res) {
	//res.json(helloObj);
// });

// task 4
//process.env.MESSAGE_STYLE='uppercase';
//app.get('/json', function(req, res){
//if(process.env.MESSAGE_STYLE==='uppercase'){
//  res.json({
//  "message": "HELLO JSON"
//})
//} else {
//    res.json({
//  "message": "Hello json"
//})
//  };
//});

// task 5
//app.use(function(req, res, next){
//  console.log(req.method + ' ' + req.path + ' - ' + req.ip);
//  next();
//})

// task 6
//app.get('/now', function(req, res, next) { 
	// middleware 1 - Add current time
//	req.time = new Date().toString();
//	next();
//}, function(req, res) { 
	// middleware 2 (handler) - Handle the response
//	res.json({time: req.time});
//});

// task 7
//app.get('/:word/echo', function(req, res) { 
//	res.json({echo: req.params.word});
//});

// task 8
//var handler = function(req, res) {
//	res.json({name: `${req.query.first} ${req.query.last}`});
//}

//app.route('/name').get(handler).post(handler);

// task 9 & 10
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//task 10
 app.post('/name', function(req, res, next) {
 	query = req.body;
 	first = query.first.toString();
 	last = query.last.toString();
 	next();
 }, function(req, res) {
	res.send({name: `${first} ${last}`})
 });






























 module.exports = app;
