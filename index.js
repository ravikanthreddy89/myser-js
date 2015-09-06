// import express module
var express = require('express');
// create an instance of express
var app = express();


var http = require('http');
var https = require('https');
var querystring = require('querystring');
// set the templating engine
app.set('view engine', 'jade');

// set the static content

app.use(express.static('common'));

app.set('basepath', "myser");
//app.use('/css', express.static(__dirname+'/common/css'));
//app.use('/js', express.static(__dirname+'/common/js'));
//app.use('/fonts', express.static(__dirname+'/common/fonts'));


// define routes
app.get('/',function(req, res, next){
     console.log('Received a GET request...');
     res.render('signin', {title : 'Index', message : "Hello world!!!"});

} );


app.post('/', function(req, res){
     console.log("Received a POST request....");
     res.write('You made a request to POST method');
     res.end();
});


app.put('/', function(req, res){
     console.log('You made a PUT request.....');
     res.write('You made a request to PUT method.');
     res.end();
});


app.get('/getToken', function(req, res){
     console.log('You have been successfully redirected ...');
     console.log('Request parameters : code = '+req.query.code);
     console.log("Making post request to the stackexchange api.....");

     res.write("Code :"+req.query.code);
     res.end();

     var postData =  querystring.stringify({
	       client_id :  5443,
	       client_secret : 'lvZynfQ5J3N)sVeL*2n5NQ((',
	       code : req.query.code,
	       redirect_uri : 'http://myser.ravikanth.me/home'

     });

     var options = {
	     host : 'https://stackexchange.com',
	     path : '/oauth/access_token',
         method : 'POST',
	     headers : {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': postData.length	     
             }
     };	     

    var reqInternal = https.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
	  });
    });


    reqInternal.on('error', function(e) {
	      console.log('problem with request: ' + e.message);
    });

     reqInternal.write(postData);
     reqInternal.end();   

});

app.get('/home', function(req, res){
    console.log('Successfully redirected.....');
    console.log('Horrayyy!!! Here is the toke  : '+req.query.code);

    var query = querystring.stringify({
	     'access_token' : req.query.code,
	     'site' : 'stackoverflow',
	     'key' : 'sRPDDdnaPzU7M9Zxw6oCjA((' 
    });

   var url = 'https://api.stackexchange.com/2.2/me';
   requestInternal = https.get( url + query,function(res) {
	      console.log("Got response: " + res.statusCode);
   }).on('error', function(e) {
	       console.log("Got error: " + e.message);
   });

    res.write("Your stackexchange account is successfully linked....");
    res.end();

});



app.all('/', function(req, res){
    console.log("You can't escape me baby !!!");
    res.write('Response from middle ware');
    res.end();
});





app.listen(3000) ;

