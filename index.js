"use strict"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const fs = require('fs');
const https = require('https');
//let render = require('./render/render').render;
let path = require('path');
let publiq = path.join(__dirname, 'public');
//const axios = require('axios');
let StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const replaceall = require("replaceall");
const utf8 = require('utf8');
const axios = require('axios-https-proxy-fix');
const URLParse = require('url-parse');

const url = "https://www.lifehacker.com:443 "

let hackFile = require('./libs/hackfile');
let relativeHTML = require('./libs/relativeHTML');
let adContainers = require('./libs/adContainers');

let pubs = require('./constant/websites');
const proxy = {
  host: 'localhost',
  port: 8003,
};

const securityHeaders = ["content-security-policy","x-content-type-options","x-content-security-policy","x-webkit-csp","x-frame-options"];

const port = 3001;
const app = express();

app.use('/static', express.static(publiq));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //console.log(req.headers.referer);
    //console.log(req.url,req.get('host'));


    // Pass to next layer of middleware
    next();
});
app.get('*',async (req, res, next) =>{
  let flgIs = false;
  if(req.url.indexOf('/site/') == -1 && req.url.indexOf('/hackfile/') == -1){
    let baseUrl = req.protocol + '://' + req.get('host');
    if(req.headers && req.headers.referer && req.headers.referer.indexOf('site') != -1){
        let siteId = req.headers.referer.replace(baseUrl + '/site/','');
        let fileExt = req.url.replace(baseUrl + '/','');
          flgIs = true;
         await loadSiteContent(req,res,siteId, fileExt);
    }
  }

  if(!flgIs){
    next();
  }

});

app.get('/',async (req, res, next) =>{
   //console.log("test");
   //console.log(req.query);
   res.send();
});
app.get('/pubs',async (req, res, next) =>{
  let response = pubs.createKeyValeuMap();
  res.send(response);
});

let loadSiteContent = async (req,res,siteUrl,exFile) =>{
    //console.log(siteUrl);
    //console.log(req);
    let url = Buffer.from(siteUrl, 'base64').toString();
    let port = 443;
    url = pubs.createValidSiteURL(url,port);
    let baseURl = url + exFile;

    //console.log(baseURl,"ewere");
    let result = await proxyCall(baseURl,req,false);
    await writeProxyResponse(result,res,false);
};

app.get('/site/:siteurl',async (req, res, next) =>{
  //console.log(req.headers);
  //console.log(req);
  let url = Buffer.from(req.params.siteurl, 'base64').toString();
  let port = 443;
  url = pubs.createValidSiteURL(url,port);
  let baseURl = req.protocol + '://' + req.get('host') + '/site/';
  let result = await proxyCall(url,req,false);
  await writeProxyResponse(result,res,false,(html) =>{
      let newhtml = relativeHTML.convertURLsToAbs(baseURl,URLParse(url, true).origin,html);
      //console.log("Adconatienrs",adContainers.getAdContainers(html));
      return newhtml;
    });;
});

app.get('/hackfile/:siteurl/:hp/:fm',async (req, res, next) =>{
    console.log('212121');
    let url = Buffer.from(req.params.siteurl, 'base64').toString();
    let hackPath = Buffer.from(req.params.hp, 'base64').toString();
    let format = req.params.fm;
    let port = 443;
    url = pubs.createValidSiteURL(url,port);

    //let url = pubs.getWebsiteURLById(siteId);
    let hackFilePath = hackPath == 'use'?hackFile(url,format):[hackPath];
    //console.log(hackFilePath,url);
    if(hackFilePath && hackFilePath.length > 0){
      //for(var i=0;i<1;i++){
        let result = await proxyCall(hackFilePath[0],req,true);
        result.data = await modifyScript(result.data);
        await writeProxyResponse(result,res);
      //}
    }
});

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

/*app.listen(port, function () {
  console.log("Server is running on "+ port +" port");
});*/

var proxyCall = async function(url,req,isProxyRequired){
  /*const agent = new https.Agent({
    rejectUnauthorized: false
  });*/
  var config = {
                  headers: {
  		                  'User-Agent': req.headers['user-agent']
         }
  }
  if(isProxyRequired){
      config['proxy'] = proxy;
  }

  //const result = await axios.get(url, {httpsAgent: agent,proxy:proxy});
  const result = await axios.get(url, config);
  //console.log(result.data);
  return result;
};

var writeProxyResponse = async function(result,res,flgEnd,cbProcessData){
  if(result && result.status == 200){
    if(result.headers){
      for(var key in result.headers){
        if(securityHeaders.indexOf(key) == -1){
          res.setHeader(key, result.headers[key])
        }
      }
    }
    //console.log(result.data);
    if(cbProcessData){
      result.data = cbProcessData(result.data);
    }
    res.write(result.data);
    if(!flgEnd){
      res.end();
    }
  }
}

//app.listen(port, () => console.log('Example app listening on port 3000!'))

https.createServer({
      key: fs.readFileSync('rootCA.key'),
      cert: fs.readFileSync('rootCA.crt')
    }, app).listen(port);
