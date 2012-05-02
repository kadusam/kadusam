function DataTable() {
  $ = jQuery;

  function createTableHeader(headers) {
    var tr = $('<tr>');
    var l = headers.length;
    for(var i=0; i<l; ++i) {
      tr.append($('<th>').text(headers[i]));
    }
    return tr;
  }

  this.setHeaders = function(headers) {
    this.headers = headers;
  }; 

  this.getTableElement = function() {
    var table = $('<table>');
    table.append(createTableHeader(this.headers));
    return table;
  };
}
