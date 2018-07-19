const cheerio = require('cheerio');

let loadHTML = (html) => {
  const $ = cheerio.load(html);
  return $;
}

let getAdContainers = (html) => {
   let $ = loadHTML(html);
   var adCntrs = [];
   $('div').filter(function () {
      var containerFound = false;
      let className = this.attribs.class;
      //console.log(this);
      if(className && className.search(/mrec|halfpage|leaderboard|billboard|-ad|ad-|_ad|ad_/i)>0){
        containerFound = true;
        adCntrs = addToAdContainers($,adCntrs,"."+ className.trim().replace(/ /g, "."));
        //adCntrs.push("."+ className.trim().replace(/ /g, "."));
      }
      let id = this.id;
      if (!containerFound && id) {
        if(id.search(/mrec|halfpage|leaderboard|billboard|-ad|-Ad/i)>0){
          adCntrs = addToAdContainers($,adCntrs,"#"+ id);
          //adCntrs.push("#"+ id);
        }
      }
   });
   handleHeightWidthOfContainer($,adCntrs);
   return adCntrs;
}

let handleHeightWidthOfContainer = ($,adContainers) => {
  if(adContainers && adContainers.length > 0){
      for(var i=0;i<adContainers.length;i++){
          console.log(adContainers[i]);
          //console.log($(adContainers[i]).height(),$(adContainers[i]).width());
      }
  }
}

let addToAdContainers = ($,adContainers,cont) => {
  console.log(cont,adContainers.length);
  var isChild = false;
  var isParent = false;
   if(adContainers && adContainers.length > 0){
     for(var i=0;i<adContainers.length;i++){
       if($(adContainers[i]).has(cont).length > 0){
         isChild = true;
         break;
       }
       if($(cont).has(adContainers[i]).length > 0){
         adContainers[i] = cont;
         isParent = true;
         break;
       }
     }
   }
   //console.log(isChild,isParent);
   if(isChild || isParent){
     return adContainers;
   }

   adContainers.push(cont);
   return adContainers;
}

module.exports = {
  getAdContainers:getAdContainers
}
