var ChartData = function(data) {
  this.data = data;

  this.time_key = 'time';
  this.value_key = 'value';

  this.resolve = Resolver.by1min;
  this.aggregate = Aggregation.average;

  this.export = function(){
    var data = this.data;
    var length = data.length;
    var ret = new Array();

    var time_key = this.time_key;
    var value_key = this.value_key

    if (!data.length) {
      return ret;
    }

    var prev = this.resolve(new Date(data[0][time_key]));
    var values = new Array();
    for(var i=0; i < length; ++i) {
      var cur = this.resolve(new Date(data[i][time_key]));
      if (cur != prev && 0 < values.length) {
        ret.push([this.offsetTimezone(prev), this.aggregate(values)]);
        prev = cur;
        values = new Array();
      }
      values.push(data[i][value_key]);
    }

    if (0 < values.length) {
        ret.push([this.offsetTimezone(prev), this.aggregate(values)]);
    }

    return ret;
  };

  this.offsetTimezone = function (epoch) {
    var offset = (new Date()).getTimezoneOffset() * 60 * 1000;
    return epoch - offset;
  },
  this.unOffsetTimezone = function (epoch) {
    var offset = (new Date()).getTimezoneOffset() * 60 * 1000;
    return epoch + offset;
  },


  this.getByTime = function(time) {
    var data = this.data;
    var length = data.length;
    var ret = new Array();

    time = this.unOffsetTimezone(time);
    for (var i=0; i<length; ++i) {
      var resolved = this.resolve(new Date(data[i][this.time_key]));
      if (time == resolved) {
        ret.push(data[i]);
      }
    }
    return ret;
  };
};

var Aggregation = {
  average: function(a) {
    var l = a.length;
    if (0 == l) { return 0; }

    return Aggregation.sum(a) / l;
  }
  , sum: function(a) {
    var l = a.length;
    if (0 == l) { return 0; }

    var sum = 0;
    for(var i=0; i<l ;++i) {
      sum += Number(a[i]);
    }
  
    return sum;
  }
  , count: function(a) {
    return a.length;
  }
};

var Resolver = {
  by1min: function(d) {
    d.setSeconds(0);
    return d.getTime();
  },
  by5min: function(d) {
    d.setSeconds(0);
    d.setMinutes(Math.floor((d.getMinutes()/5))*5);
    return d.getTime();
  },
  by10min: function(d) {
    d.setSeconds(0);
    d.setMinutes(Math.floor((d.getMinutes()/10))*10);
    return d.getTime();
  }
};

