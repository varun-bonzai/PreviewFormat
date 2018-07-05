const URLParse = require('url-parse');

const data = {
  "eerr-dfdfdf":{
    url:"https://www.news.com.au",
    name:"news.com.au",
    container:"",
    port:443
  },
  "wewe-erere":{
    url:"https://www.vogue.com.au",
    name:"vogue.com.au",
    container:"",
    port:443
  },
  "ewewew-2121":{
    url:"https://www.gq.com.au",
    name:"gq.com.au",
    container:"",
    port:443
  },
  "wqwqww-wwew":{
    url:"https://www.dailytelegraph.com.au",
    name:"gq.com.au",
    container:"",
    port:443
  }
};

let createKeyValeuMap = () =>{
  let map = [];
  for(var key in data){
    map.push({key:key,value:data[key].name})
  }
  return map;
}

let getWebsiteURLById = (id) => {
   if(data && data[id]){
     let url = data[id].url;
     let port = data[id].port;
     return url + ':' + port;
   }
   return "";
}

let createValidSiteURL = (url,port) =>{
  if(url.indexOf('http') == -1){
    url = 'https://' + url;
  }
  let parseDetails = URLParse(url,true);
  console.log(parseDetails);
  let finUrl = parseDetails.origin + ':' + port;
  if(parseDetails.protocol == ''){
      finUrl = 'https://' + finUrl;
  }
  if(parseDetails.pathname != ''){
    finUrl = finUrl + parseDetails.pathname;
  }
   return finUrl;
}

module.exports = {
  data:data,
  createKeyValeuMap:createKeyValeuMap,
  getWebsiteURLById:getWebsiteURLById,
  createValidSiteURL:createValidSiteURL
}
