var mongo = require('mongodb');
var express = require('express');
var config = require('./conf.js');
var db = new mongo.Db('dak', new mongo.Server(config.db.host, config.db.port, {}), {native_parser:false});
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

app.get('/t1/', function(req, res) {
  dak(function(err, c) {
    var cond = {
      time: {
        $gt:new Date(Number(req.param('min'))),
        $lt:new Date(Number(req.param('max')))
      }
    };

    c.find(cond).toArray(function(err, results) {
      res.json(results);
    });
  });
});

app.get('/api/data', function(req, res) {

  var action = req.param('action');
  var from = toDate(req.param('from'));
  if (isNaN(from.valueOf())) {
    res.json('oops! invalid parameter', 400);
  }
  var to = toDate(req.param('to'));
  if (req.params.to && isNaN(to.valueOf())) {
    res.json('oops! invalid parameter', 400);
  }

  console.log("api data: ", action, from, to); 

  dak(function(err, c) {
    var cond = {
      time: {$gt:from}
    };
    if (action) {
      cond.action=action;
    }

    if (to) {
      cond.time.$lt=to;
    }

    c.find(cond).toArray(function(err, results) {
      
      var ret = []; 
      results.forEach(function(r) {
        ret.push([new Date(r.time).getTime()+9*3600*1000, Number(r.response_time)]);
      });
      res.json(ret);

    });
  });
});

app.get('/api/point', function(req, res) {
  var time = toDate(req.param('time'));
  if (!time) {
    res.json('oops! invalid parameter', 400);
  }
  
  dak(function(err, c) {
    var cond = {
      time: time
    };

    c.find(cond).toArray(function(err, results) {
      res.json(results);
    });
  });
});

app.get('/api/list/actions', function(req, res) {
  dak(function(err, c) {
    c.distinct("action", (function(err, results) {
      res.json(results);
    }));
  });
});


function dak(callback) {
  db.collection('app', callback);
}

function toDate(str) {
  if (str) {
    if (str.match(/^[0-9]*$/)) {
      return new Date(parseInt(str));
    }
    return new Date(str);
  }

  return undefined;
}

app.listen(config.http.port);
