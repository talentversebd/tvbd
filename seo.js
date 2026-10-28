/* Search-engine helpers: breadcrumbs on inner pages + Event structured data built from the live event list. */
(function(){
 try{
  var d=document,base='https://talentversebd.github.io/tvbd/';
  var rob=d.querySelector('meta[name="robots"]');
  if(rob&&/noindex/i.test(rob.content))return;
  function put(id,obj){
   var old=d.getElementById(id);if(old)old.remove();
   var s=d.createElement('script');s.type='application/ld+json';s.id=id;s.text=JSON.stringify(obj);d.head.appendChild(s);
  }
  var f=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(f!=='index.html'){
   var name=(d.title||'').split('—')[0].trim()||f;
   put('seo-bc',{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":base},
    {"@type":"ListItem","position":2,"name":name,"item":base+f}]});
  }
  if(f==='index.html'||f==='events.html'){
   var tries=0,t=setInterval(function(){
    tries++;
    var list=(typeof getOlympiads==='function')?getOlympiads():null;
    if(list&&list.length){
     clearInterval(t);
     var items=[];
     list.slice(0,20).forEach(function(o,i){
      if(!o||!o.title)return;
      var ev={"@type":"Event","name":o.title,"description":String(o.desc||o.fullDesc||o.title).slice(0,300),
       "eventAttendanceMode":"https://schema.org/MixedEventAttendanceMode","eventStatus":"https://schema.org/EventScheduled",
       "organizer":{"@type":"Organization","name":"TalentVerse Bangladesh","url":base},
       "url":base+'events.html',
       "location":{"@type":"Place","name":o.venue||"Bangladesh","address":{"@type":"PostalAddress","addressCountry":"BD"}}};
      if(/^\d{4}-\d{2}-\d{2}/.test(String(o.date||'')))ev.startDate=String(o.date).slice(0,10);
      if(o.img&&/^https:/.test(o.img))ev.image=o.img;
      items.push({"@type":"ListItem","position":i+1,"item":ev});
     });
     if(items.length)put('seo-events',{"@context":"https://schema.org","@type":"ItemList","itemListElement":items});
    }else if(tries>40)clearInterval(t);
   },500);
  }
 }catch(e){}
})();
