var express=require('express');
var app=express();
var  mysql=require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'foodNames'
});

connection.connect();

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){
res.render('index.html');
});

app.get('/search',function(req,res){
connection.query('SELECT recipeName from name where recipeName like "'+req.query.key+'%"', function(err, rows, fields) {
	  if (err) throw err;
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].recipeName);
      }
      res.end(JSON.stringify(data));
	});
});

var server=app.listen(3000,function(){
console.log("We have started our server on port 3000");
});
