
let proxyLib = require('../libs/proxyLib');
let relativeHTML = require('../libs/relativeHTML');
const replaceall = require("replaceall");

module.exports = {
   loadSite:async (siteModelobj) => {
      let url = siteModelobj.getURL();
      let userAgent = siteModelobj.getUserAgent();
      let baseUrl = siteModelobj.getSiteBaseUrl();

      let result = await proxyLib.proxyCall(url,userAgent,false);
      result.data = relativeHTML.convertURLsToAbs(baseUrl,url,result.data);
      return result;
   },

   updateResponseHeaders : async (res,result) => {
      proxyLib.modifyResHeaders(res,result);
   },

   loadHackFiles : async function(hackFiles,userAgent){
      let hackScript = "";
      if(hackFiles && hackFiles.length > 0){
         for(var i=0;i<hackFiles.length;i++){
            let path = hackFiles[i];
            let result = await proxyLib.proxyCall(path,userAgent,false);
            hackScript += this.modifyScript(result.data);
         }
      }
      return hackScript;
   },

   modifyScript :function(script){
     //console.log(script,"test111");
     var result = replaceall("window.top", "window", script);
     result = replaceall('closestAncestor: 2', "closestAncestor: 100", result);
     result = replaceall('closestAncestor: 1', "closestAncestor: 100", result);
     result = replaceall('none', "block", result);

     return result;
  }
}
