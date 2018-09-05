var absolutify = require('absolutify');
const cheerio = require('cheerio');
const URLParse = require('url-parse');

let loadHTML = (html) => {
  const $ = cheerio.load(html);
  return $;
}

module.exports = {
   convertURLsToAbs:(baseURL,hackSiteURL,html) => {
      let $ = loadHTML(html);
      $('a').each(function(){
          let Url = $(this).attr('href');
          let urlObj = URLParse(Url);
          let actualURL = urlObj.href;
          //console.log(urlObj);
          if(urlObj.origin == 'null'){
              actualURL = hackSiteURL + actualURL;
              //console.log(actualURL,"dasasasa");
          }
          var b = new Buffer(actualURL);
          var s = b.toString('base64');
          $(this).attr('href',baseURL + s);
      });
      return $.html();
   },
   convertURLsToAbs1:(baseURL,hackSiteURL,html) => {
      var parsed = absolutify(html, function(url, attrName) {
        var b = new Buffer(hackSiteURL + url);
        var s = b.toString('base64');
        return baseURL + s;
      });
      return parsed;
   }
}
