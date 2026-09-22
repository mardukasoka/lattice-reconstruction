(function(){
  var cat=window.LRA_CATALOGUE, host=document.getElementById("lra-catalogue");
  if(!cat||!host)return;
  var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]})};
  var out="<summary>"+esc(cat.centre.toUpperCase())+" · OPEN OBJECTS</summary>";
  cat.objects.forEach(function(o){
    out+='<div class="lra-object">'+(o.image?'<img src="'+esc(o.image)+'" alt="'+esc(o.title+" "+o.id)+'">':'<div class="lra-noimage" aria-label="No reusable image verified">NO OPEN IMAGE</div>')+'<div><strong>'+esc(o.id)+" · "+esc(o.title)+'</strong><div class="lra-meta">'+esc(o.meta)+'<br>Image: '+esc(o.attribution)+'</div><div class="lra-links"><a href="'+esc(o.imagePage)+'" target="_blank" rel="noopener">IMAGE</a><a href="'+esc(o.source)+'" target="_blank" rel="noopener">SOURCE</a></div></div></div>';
  });
  host.innerHTML=out;
})();