let siteLoaderService = require('../services/siteLoaderService');
let utils = require('../libs/utils');
let siteModel = require('../model/siteModel');
let hackFile = require('../libs/hackfile');

let getBaseUrl = (req)=>{
  let baseUrl = req.protocol + '://' + req.get('host') + "/site/";
  return baseUrl;
};

module.exports = {
  loadSiteUrl: async function(req,res){
    let url = Buffer.from(req.params.siteurl, 'base64').toString();
    var baseUrl = getBaseUrl(req);
    let siteModelObj = new siteModel(url,req.headers['user-agent'],null,baseUrl);

    let result = await siteLoaderService.loadSite(siteModelObj);
    siteLoaderService.updateResponseHeaders(res,result);
    res.write(result.data);
    res.end();
  },



  loadHackUrl: async function(req,res){
    let url = Buffer.from(req.params.siteurl, 'base64').toString();
    let hackPath = Buffer.from(req.params.hp, 'base64').toString();
    let format = req.params.fm;

    let hackFilePath = (hackPath == 'use')?hackFile(url,format):[hackPath];
    let data = await siteLoaderService.loadHackFiles(hackFilePath,req.headers['user-agent']);
    res.write(data);
    res.end();
  },

  loadSiteContent: async function(req,res,next){
    let flgIs = false;
    if(req.url.indexOf('/site/') == -1 && req.url.indexOf('/hackfile/') == -1){
      let baseUrl = getBaseUrl(req);
      if(req.headers && req.headers.referer && req.headers.referer.indexOf('site') != -1){
          let siteId = req.headers.referer.replace(baseUrl,'');
          let fileExt = req.url.replace(baseUrl + '/','');
          flgIs = true;
          let url = Buffer.from(siteId, 'base64').toString();
          let siteModelObj = new siteModel(siteId,req.headers["User-Agent"],fileExt,baseUrl);
          let result = await siteLoaderService.loadSite(siteModelObj);
          siteLoaderService.updateResponseHeaders(res,result);
          res.write(result.data);
          res.end();
      }
    }

    if(!flgIs){
      next();
    }
  }

}
