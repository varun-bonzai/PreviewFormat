var absolutify = require('absolutify');

module.exports = {
   convertURLsToAbs:(baseURL,hackSiteURL,html) => {
      var parsed = absolutify(html, function(url, attrName) {
        return url;
        console.log(attrName,url);
        var b = new Buffer(hackSiteURL + url);
        var s = b.toString('base64');
        return baseURL + s;
      });
      return parsed;
   }
}
