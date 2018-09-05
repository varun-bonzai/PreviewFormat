const axios = require('axios-https-proxy-fix');
const proxy = {
  host: 'localhost',
  port: 8003,
};
const securityHeaders = ["content-security-policy","x-content-type-options","x-content-security-policy","x-webkit-csp","x-frame-options"];

module.exports = {
  proxyCall : async (url,userAgent,isProxyRequired) => {
    var config = {
        headers: {
	          'User-Agent': userAgent
        }
    };
    if(isProxyRequired){
        config['proxy'] = proxy;
    }
    console.log(url,"test")
    const result = await axios.get(url, config);
    return result;
  },

  modifyResHeaders : (res,result) => {
    if(result.headers){
      for(var key in result.headers){
        if(securityHeaders.indexOf(key) == -1){
          res.setHeader(key, result.headers[key])
        }
      }
    }
  }
}
