const URLParse = require('url-parse');

module.exports = {
  createValidSiteURL : (url,port) =>{
    if(url.indexOf('http') == -1){
      url = 'https://' + url;
    }
    let parseDetails = URLParse(url,true);
    let finUrl = parseDetails.origin + ':' + port;
    if(parseDetails.protocol == ''){
        finUrl = 'https://' + finUrl;
    }
    if(parseDetails.pathname != ''){
      finUrl = finUrl + parseDetails.pathname;
    }
     return finUrl;
  }
}
