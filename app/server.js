var mongo = require('mongodb');
var express = require('express');
var config = require('./conf.js');
var db = new mongo.Db('dak', new mongo.Server(config.db.host, config.db.port, {}), {native_parser:true});
db.open(function(){});

var app = express.createServer();

// Configuration
app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Router
app.get('/', function(req, res){
  res.render('index');
});

app.get('/test/:id', function(req, res) {
  res.send('id:' + req.params.id);
});

app.get('/t1/', function(req, res) {
  res.contentType('application/json');

  dak(function(err, c) {
    c.find({time: {$gt:new Date("2012-01-31 10:55:00"), $lt:new Date("2012-01-31 19:00:00")}})
      .toArray(function(err, results) {
        res.send(results);
    });
  });
});

function dak(callback) {
  db.collection('app', callback);
}

app.get('/mg/', function(req, res) {
  res.contentType('application/json');

  var insert_id = req.params.id;
  db.collection('test', function(err, collection) {
    collection.find({id: {$or: [{$gt:'1'}, {$gt:1}]}}).toArray(function(err, results){
      res.send(results);
    });
    collection.find().toArray(function(err, results){
      res.send(results);
    });
  });
});

app.get('/mg/:id/:name', function(req, res) {
  //var data = {id:parseInt(req.params.id), data:req.params.name};
  var data = {id:req.params.id, data:req.params.name};
  db.collection('test', function(err, collection) {
    collection.insert(data, function(err, docs){});
    res.send("insert ok");
    console.log(data);
  });
});





app.listen(3000);




