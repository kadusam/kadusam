describe('FetchData', function(){

  it('インスタンスが作れる', function() {
    new FetchData();
  });

  it('コンストラクタが取得URL', function() {
    var fd = new FetchData('/hoge');
    expect(fd.fetchUrl).toEqual('/hoge');
  });

}); 
