describe('DataTable', function() {
  it('オブジェクトが存在すること', function() {
    var dt = new DataTable();
  });
  
  it('a', function() {
    var dt = new DataTable();
    dt.setHeaders(['a', 'b', 'c']);
    table = dt.getTableElement();

    expect(table.find('th').length).toEqual(3);
    expect(table.find('th').text()).toEqual("abc");
  });
});
