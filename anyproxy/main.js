const AnyProxy = require('anyproxy');

const exec = require('child_process').exec;


let createServer = () => {
  const options = {
    port: 8001,
    rule: require('./myRule'),
    webInterface: {
      enable: true,
      webPort: 8002
    },
    throttle: 10000,
    forceProxyHttps: true,
    dangerouslyIgnoreUnauthorized:true,
    wsIntercept: false,
    silent: false
  };
  const proxyServer = new AnyProxy.ProxyServer(options);

  proxyServer.on('ready', () => { /* */ });
  proxyServer.on('error', (e) => { /* */ });
  proxyServer.start();
}


  if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
    AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
      // let users to trust this CA before using proxy
      if (!error) {
        const certDir = require('path').dirname(keyPath);
        console.log('The cert is generated at', certDir);
        const isWin = /^win/.test(process.platform);
        if (isWin) {
          exec('start .', { cwd: certDir });
        } else {
          exec('open .', { cwd: certDir });
        }
      } else {
        console.error('error when generating rootCA', error);
      }
    });
  }
  else{
    createServer();
  }





//when finished
//proxyServer.close();
