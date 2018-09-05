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
const utf8 = require('utf8');

const URLParse = require('url-parse');

const url = "https://www.lifehacker.com:443 "
let utils = require('./libs/utils');

let relativeHTML = require('./libs/relativeHTML');
let adContainers = require('./libs/adContainers');

let mainController = require('./controller/mainController');

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
app.get('*',mainController.loadSiteContent);

app.get('/',async (req, res, next) =>{
   //console.log("test");
   //console.log(req.query);
   res.send();
});
app.get('/pubs',async (req, res, next) =>{
  let response = pubs.createKeyValeuMap();
  res.send(response);
});

app.get('/site/:siteurl',mainController.loadSiteUrl);

app.get('/hackfile/:siteurl/:hp/:fm',mainController.loadHackUrl);

//app.listen(port, () => console.log('Example app listening on port 3000!'))

https.createServer({
      key: fs.readFileSync('rootCA.key'),
      cert: fs.readFileSync('rootCA.crt')
    }, app).listen(port);
