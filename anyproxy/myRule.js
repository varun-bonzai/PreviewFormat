let HttpProxyRules = require('http-proxy-rules');
let path = require('path');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const replaceall = require("replaceall");
const utf8 = require('utf8');
const axios = require('axios');

var options = {
    rules: {
      '.*/static/index.html' : 'https://localhost:3000/static/index.html', // Rule (1),
      '.*/static/css/main.less': 'https://localhost:3000/static/css/main.less',
      '.*/static/js/main.js': 'https://localhost:3000/static/js/main.js',
      '.*/site': 'https://localhost:3000/site'
    },
    default: '' // default target
  };

let proxyRules = new HttpProxyRules(options);

module.exports = {
  *beforeSendResponse(requestDetail, responseDetail) {
    //console.log(requestDetail.url);
    if (requestDetail.url.indexOf('desktop_truskin') != 11121) {
      const newResponse = responseDetail.response;
      //console.log(newResponse);
      /*newResponse.body = '-- AnyProxy Hacked! --';
      return new Promise((resolve, reject) => {
        setTimeout(() => { // delay the response for 5s
          resolve({ response: newResponse,isTest:true,url: requestDetail.url});
        }, 5000);
      });*/
      return axios.get(requestDetail.url)
              .then(response => {
                  newResponse.body = modifyScript(response.data);
                  return decodeandZip(newResponse.body)
                  //console.log(newResponse.body);
                  //return { response: newResponse };
              })
            .then(data => {
                responseDetail.response.body = data;
                return responseDetail;
            })
            .catch(error => {
              console.log(error);
        });
      /*return unzipandDecode(newResponse.body).then(function(script){
                return modifyScript(script)
              }).then(function(data){
                return decodeandZip(data);
              }).then(function(data){
                newResponse.body = data;
                return newResponse;
              })*/
    }
  },
  *beforeSendRequest(requestDetail){
      let req = requestDetail._req;
      let target = proxyRules.match(req);

      requestDetail.requestOptions.headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36';
      //console.log(target,"test");
      //  console.log(req);
      if(target){
        let t = url.parse(target);
        //console.log(t);
        //console.log(requestDetail.requestOptions);
        requestDetail.url = target;
        requestDetail.requestOptions.hostname = t.hostname;
        requestDetail.requestOptions.port = t.port;
      }
      return {
        url:requestDetail.url,
        requestOptions:requestDetail.requestOptions
      };
  }
};


let unzipandDecode = function(data){
  var zlib = require('zlib');
  //console.log(data,11);
  var textChunk = decoder.write(data);
  //console.log(textChunk,"err");
  return new Promise(function(resolve, reject) {
      zlib.gunzip(data, function(err, dezipped)
      {
        //console.log(err);
        //console.log(dezipped,"tesststs")
        //console.log(dezipped,"sasasa");
        var textChunk = decoder.write(dezipped);
        //console.log(textChunk,"sasasa");
        resolve(textChunk);
      });
  });
}

let modifyScript = function(script){
   //console.log(script,"test111");
   var result = replaceall("window.top", "window", script);
   result = replaceall('none', "block", result);

   return result;
}

let decodeandZip = function(data){
  return new Promise(function(resolve, reject) {
    let d1 = utf8.encode(data);
    resolve(d1);
    /*zlib.gzip(d1, function(err, zipped) {
      //console.log(dezipped,"tesststs")
      resolve(zipped);
    });*/
  });
}
