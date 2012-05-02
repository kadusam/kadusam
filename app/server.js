var mongo = require('mongodb');
var express = require('express');
var config = require('./conf.js');
var db = new mongo.Db('apache', new mongo.Server(config.db.host, config.db.port, {}), {native_parser:false});
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
app.get('/next', function(req, res){
  res.render('next');
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
  if (!from) {
    res.json('oops! invalid parameter', 400);
    return;
  }
  var to = toDate(req.param('to'));
  if (req.param('to') && !to) {
    res.json('oops! invalid parameter', 400);
    return;
  }

  console.log("api data: action:", action, ' from:', from, ' to', to); 

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

app.get('/api/alldata', function(req, res) {
  var from = toDate(req.param('from'));
  if (!from) {
    res.json('oops! invalid parameter', 400);
    return;
  }
  var to = toDate(req.param('to'));
  if (!to) {
    res.json('oops! invalid parameter', 400);
    return;
  }

  dak(function(err, c) {
    var cond = {
      time: {$gt:from, $lt:to}
    };

    console.log(cond);
    c.find(cond).toArray(function(err, results) {
      res.json(results);
    });
  });

});

app.get('/api/point', function(req, res) {
  var time = toDate(req.param('time'));
  if (!time) {
    res.json('oops! invalid parameter', 400);
    return;
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
  db.collection('access', callback);
}

function toDate(str) {
  var ret = null;
  if (str) {
    if (str.match(/^[0-9]*$/)) {
      ret = new Date(parseInt(str));
    } else {
      ret = new Date(str);
    }
  }
  
  if (!ret || isNaN(ret.valueOf())) {
    return null;
  }
  return ret;
}

app.listen(config.http.port);
