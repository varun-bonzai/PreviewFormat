let siteId = "wewe-erere";
let siteURL = "www.news.com.au";


let getParamFromQueryStr =(paramName) =>{
  var queries = {};
   $.each(document.location.search.substr(1).split('&'),function(c,q){
     var i = q.split('=');
     queries[i[0].toString()] = i[1].toString();
   });
   //console.log(queries);
   return queries[paramName];
}

window.onload = function(){

    siteURL = getParamFromQueryStr('url') || "www.news.com.au";
    var div = document.getElementById('frameCont');
    var iframe = document.createElement('iframe');
    iframe.id = "mainFrame";
    iframe.src = window.origin + '/site/' + btoa(siteURL);
    iframe.frameborder = 0;
    iframe.style.border = 'none'
    iframe.height = '100%';
    iframe.width = '100%';
    iframe.onload = function(){
        setTimeout(function() { iframe.style.opacity = 1 }, 500);
        render(iframe.contentWindow);
    }
    div.appendChild(iframe);
    /*var iframe = '<iframe id="mainFrame" src="http://www.news.com.au" frameborder="0" onload="'+sScript+cScript+'"></iframe>'
    div.innerHTML = iframe;*/
    //window.domain = "news.com.au"
    /*var iframeEle = document.getElementById('frameCont');
    var iframeDoc = iframeEle.contentDocument || iframeEle.contentWindow.document;
    if (  iframeDoc.readyState  == 'complete' ) {
      iframeEle.contentWindow.onload = function(){
        render(iframeEle.contentWindow);
      }
    }*/
}


let render = (contentWindow) => {
  
    /*var height = contentWindow.document.body.clientHeight;
    var wi = contentWindow.top;
    wi.document.body.style.height = 1080 + 'px';*/
   //contentWindow.document.querySelector("html").style.height = "";
  /*var css = 'html { height: auto !important; }',
        head = contentWindow.document.head || contentWindow.document.getElementsByTagName('head')[0],
        style = contentWindow.document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(contentWindow.document.createTextNode(css));
        }
        head.appendChild(style);*/

  let adContainer = getParamFromQueryStr('cont') ||  'ad-out-of-page';
  let adBlock = contentWindow.document.body.querySelector('#' + adContainer), adAppendContainer = contentWindow.document.body;
  if(!adBlock){
    adBlock = contentWindow.document.body.querySelector('.' + adContainer)
  }
  setTimeout(function(){
    if(adBlock) {
        adBlock.style.display = 'block';
        adBlock.innerHTML = '';
        adAppendContainer = adBlock;
    }
    addScriptForTag(contentWindow,adAppendContainer);
  },1000);
}

let addScriptForTag = (contentWindow,parentCont) => {
  let en = getParamFromQueryStr('en') || 'prod';
  let hackPath = getParamFromQueryStr('hp') || 'use';
  let adId = getParamFromQueryStr('adid') || '2669677243842780539';
  let format = getParamFromQueryStr('fm') || 'MTS';
  let invokeURL =  (en == "dev")?"sites.bonzai.ad/mizuInternal/inv.php":(en == "staging" || en == "qa")?'i.bonzai.co/mizu/invoke.do':'invoke.bonzai.co/mizu/invoke.do'
  let div = contentWindow.document.createElement('div');
  div.className = "bonzai-wrap"
  parentCont.appendChild(div);
  let cacheBuster = 'CACHEBUSTER';
  let bonzai_adid = adId;
  let bonzai_sn = 'DFP';
  let bonzai_data = '{"network":{"keyId":"DFP","name":"DFP","settings":{"pubHackPath":"'+window.origin +'/hackfile/' + btoa(siteURL)+'/'+btoa(hackPath)+'/' + format + '","isPreview":"false","env":"wap","tagType":"noniFrame","iFrmBust":"N","proto":"agnostic","trackerFireOn":"Clickthrough","zIndex":"23000"},"macros":{"addiTr":{"cachbust":"%%CACHEBUSTER%%","segId":""},"clkTr":{"img":[],"scr":[]},"rendTr":{"img":[],"scr":[]},"engmTr":{},"imprTr":{"img":[],"scr":[]}}}}';
  let protocol = contentWindow.location && contentWindow.location.protocol;
   protocol = (protocol === 'http:' || protocol === 'https:') ? protocol.replace(':', '') : 'https';

  let script = document.createElement('script');
  let index = contentWindow.bonzaiScriptIndex  = (typeof contentWindow.bonzaiScriptIndex == 'undefined') ? 0 : ++contentWindow.bonzaiScriptIndex;
  script.id = 'bonzai_script_' + index;
  if(!contentWindow.bonzaiObj || (typeof contentWindow.bonzaiObj == 'undefined')) {contentWindow.bonzaiObj = {};}
  contentWindow.bonzaiObj[script.id] = bonzai_data;
  script.src = protocol + '://' + invokeURL + '?proto=' + protocol + '&adid='+bonzai_adid+'&scriptid=' + script.id +'&sn='+bonzai_sn+'&contTyp=div' +'&plid=2669269004012503123'  + '&rnd=' + cacheBuster;
  //s.parentNode.insertBefore(script, s.nextSibling);
  div.appendChild(script);


  /*let hackFileScript = document.createElement('script');
  hackFileScript.src = '/hackfile/wewe-erere';
  div.appendChild(hackFileScript);*/

}
