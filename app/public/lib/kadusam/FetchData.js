var FetchData = function(url) {
  this.fetchUrl = url;

  this.fetch = function(options) {
    options.url = this.fetchUrl;
    options.data = {
      from: this.from,
      to: this.to
    };    

    $.ajax(options);
  }

};
