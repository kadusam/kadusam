describe("ChartData", function() {

  it("export1", function() {
    var d = new Date('2012-05-01T09:10:43Z');
    var data = new ChartData({id:'hoge'}); 
    expect(data.data).toEqual({id:'hoge'});
  });

  it("export2", function() {
    var raw = [
       {time:"2012-01-31T17:21:38.000Z", value:1}
    ];

    var data = new ChartData(raw);
    data.time_key = 'time';
    expect(data.export().length).toEqual(1);
  });

  it("export3", function() {
    var raw = [
       {time:"2012-01-31T17:21:38.000Z", value:1}
      ,{time:"2012-01-31T17:21:39.000Z", value:2}
      ,{time:"2012-01-31T17:22:01.000Z", value:3}
    ];

    var data = new ChartData(raw); 
    expect(data.export()).toEqual([
       [data.offsetTimezone(data.resolve(new Date(raw[0].time))), 1.5]
      ,[data.offsetTimezone(data.resolve(new Date(raw[2].time))), 3]
    ]);
  });

  it("getByTime", function() {
    var raw = [
       {time:"2012-01-31T17:21:38.000Z", value:1}
      ,{time:"2012-01-31T17:21:39.000Z", value:2}
      ,{time:"2012-01-31T17:22:01.000Z", value:3}
    ];

    var data = new ChartData(raw); 
    expect(data.getByTime(data.offsetTimezone(data.resolve(new Date(raw[0].time))))).toEqual([
       raw[0]
       , raw[1]
    ]);
    expect(data.getByTime(data.offsetTimezone(data.resolve(new Date(raw[2].time))))).toEqual([
       raw[2]
    ]);
  });
});

describe('Aggregation', function(){
  describe('average', function(){
    it('平均値が返るか', function() {
      expect(Aggregation.average([1,2,3])).toEqual(2);
    });
    it('空の場合は0が返る', function() {
      expect(Aggregation.average([])).toEqual(0);
    });
    it('文字列型の数字でも集計可能か', function() {
      expect(Aggregation.average(['1.0','10.6','5.5'])).toEqual(5.7);
    });
  });
  describe('sum', function(){
    it('合計値が返るか', function() {
      expect(Aggregation.sum([1,2,3])).toEqual(6);
    });
    it('空の場合は0が返る', function() {
      expect(Aggregation.sum([])).toEqual(0);
    });
    it('文字列型の数字でも集計可能か', function() {
      expect(Aggregation.sum(['1.0','10.6','5.5'])).toEqual(17.1);
    });
  });
  describe('count', function(){
    it('カウントが返るか', function() {
      expect(Aggregation.count([1,2,1])).toEqual(3);
    });
    it('空の場合は0が返る', function() {
      expect(Aggregation.count([])).toEqual(0);
    });
  });
});

describe('Resovlver', function(){
  describe('by1min', function(){
    it('同一分では同じ値が返る', function() {
      expect(Resolver.by1min(new Date('2012-01-31T17:21:10.000Z'))).toEqual(
             Resolver.by1min(new Date('2012-01-31T17:21:20.000Z'))
      );
    });
    it('異なる分では異なる値が返る', function() {
      expect(Resolver.by1min(new Date('2012-01-31T17:21:10.000Z'))).toNotEqual(
             Resolver.by1min(new Date('2012-01-31T17:22:10.000Z'))
      );
    });
  });
  describe('by5min', function(){
    it('同一セグメントでは同じ値が返る', function() {
      expect(Resolver.by5min(new Date('2012-01-31T17:20:00.000Z'))).toEqual(
             Resolver.by5min(new Date('2012-01-31T17:24:59.000Z'))
      );
    });
    it('異なるセグメントでは異なる値が返る', function() {
      expect(Resolver.by5min(new Date('2012-01-31T17:20:00.000Z'))).toNotEqual(
             Resolver.by5min(new Date('2012-01-31T17:25:00.000Z'))
      );
    });
  });
  describe('by10min', function(){
    it('同一セグメントでは同じ値が返る', function() {
      expect(Resolver.by10min(new Date('2012-01-31T17:20:10.000Z'))).toEqual(
             Resolver.by10min(new Date('2012-01-31T17:29:20.000Z'))
      );
    });
    it('異なるセグメントでは異なる値が返る', function() {
      expect(Resolver.by10min(new Date('2012-01-31T17:20:10.000Z'))).toNotEqual(
             Resolver.by10min(new Date('2012-01-31T17:30:10.000Z'))
      );
    });
  });
});
