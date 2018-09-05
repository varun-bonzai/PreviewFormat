let utils = require('../libs/utils');
let sslPort = 443;

let siteModel = function(url,userAgent,fileExt,siteBaseURL){
  this.siteUrl = utils.createValidSiteURL(url,sslPort);
  this.userAgent = userAgent;
  this.fileExt = fileExt;
  this.siteBaseUrl = siteBaseURL;

  this.getURL = () => {
    return this.siteUrl + (this.fileExt?this.fileExt:'');
  };


  this.getUserAgent= ()=>{
    return this.userAgent;
  }

  this.getSiteBaseUrl =() =>{
    return this.siteBaseUrl;
  }
}

module.exports = siteModel;
