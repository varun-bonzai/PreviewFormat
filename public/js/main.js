let siteId = "wewe-erere";
let siteURL = "www.news.com.au";


let getParamFromQueryStr =(paramName) =>{
  var queries = {};
   $.each(document.location.search.substr(1).split('&'),function(c,q){
     var i = q.split('=');
     queries[i[0].toString()] = i[1].toString();
   });
   console.log(queries);
   return queries[paramName];
}



window.onload = function(){

    siteURL = getParamFromQueryStr('url') || "www.news.com.au";
    var div = document.getElementById('frameCont');
    var iframe = document.createElement('iframe');
    iframe.id = "mainFrame";
    iframe.src = 'https://localhost:3000/site/' + btoa(siteURL);
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
  console.log(contentWindow.domain,"test");
    /*var height = contentWindow.document.body.clientHeight;
    var wi = contentWindow.top;
    wi.document.body.style.height = 1080 + 'px';*/
   //contentWindow.document.querySelector("html").style.height = "";
  var css = 'html { height: auto !important; }',
        head = contentWindow.document.head || contentWindow.document.getElementsByTagName('head')[0],
        style = contentWindow.document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(contentWindow.document.createTextNode(css));
        }
        head.appendChild(style);

  let adBlock = contentWindow.document.body.querySelector('#ad-out-of-page') || contentWindow.document.body.querySelector('.ad-block.ad-custom.ad-custom-desktop'), adAppendContainer = contentWindow.document.body;
  if(adBlock) {
      adBlock.style.display = 'block';
      adBlock.innerHTML = '';
      adAppendContainer = adBlock;
  }
  addScriptForTag(contentWindow,adAppendContainer);
}

let addScriptForTag = (contentWindow,parentCont) => {
  let adId = getParamFromQueryStr('adid') || '2669677243842780539'
  let div = contentWindow.document.createElement('div');
  div.className = "bonzai-wrap"
  parentCont.appendChild(div);
  let cacheBuster = 'CACHEBUSTER';
  let bonzai_adid = adId;
  let bonzai_sn = 'DFP';
  let bonzai_data = '{"network":{"keyId":"DFP","name":"DFP","settings":{"pubHackPath":"/hackfile/' + btoa(siteURL)+'","isPreview":"false","env":"wap","tagType":"noniFrame","iFrmBust":"N","proto":"agnostic","trackerFireOn":"Clickthrough","zIndex":"23000"},"macros":{"addiTr":{"cachbust":"%%CACHEBUSTER%%","segId":""},"clkTr":{"img":["%%CLICK_URL_UNESC%%"],"scr":[]},"rendTr":{"img":[],"scr":[]},"engmTr":{},"imprTr":{"img":["%%VIEW_URL_UNESC%%"],"scr":[]}}}}';
  let protocol = contentWindow.location && contentWindow.location.protocol;
   protocol = (protocol === 'http:' || protocol === 'https:') ? protocol.replace(':', '') : 'https';

  let script = document.createElement('script');
  let index = contentWindow.bonzaiScriptIndex  = (typeof contentWindow.bonzaiScriptIndex == 'undefined') ? 0 : ++contentWindow.bonzaiScriptIndex;
  script.id = 'bonzai_script_' + index;
  if(!contentWindow.bonzaiObj || (typeof contentWindow.bonzaiObj == 'undefined')) {contentWindow.bonzaiObj = {};}
  contentWindow.bonzaiObj[script.id] = bonzai_data;
  script.src = protocol + '://i.bonzai.co/mizu/invoke.do?proto=' + protocol + '&adid='+bonzai_adid+'&scriptid=' + script.id +'&sn='+bonzai_sn+'&contTyp=div' +'&plid=2669269004012503123'  + '&rnd=' + cacheBuster;
  //s.parentNode.insertBefore(script, s.nextSibling);
  div.appendChild(script);


  /*let hackFileScript = document.createElement('script');
  hackFileScript.src = '/hackfile/wewe-erere';
  div.appendChild(hackFileScript);*/

}
