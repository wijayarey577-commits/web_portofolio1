function openDetail(id){
  var p=DB.projects.find(function(x){return x.id===id;});if(!p)return;
  currentDetailId=id;
  var cats=Array.isArray(p.cats)?p.cats:(p.cats||"").split(" ").filter(Boolean);
  var imgs=p.images||[];
  document.getElementById("pd-nav-title").textContent=p.title;
  var badge=document.getElementById("pd-nav-badge");
  badge.className="pd-nav-badge "+(p.status==="done"?"b-done":"b-wip");
  badge.textContent=p.status==="done"?"Completed":"In Progress";
  var heroImg=document.getElementById("pd-hero-img"),heroFb=document.getElementById("pd-hero-fallback");
  if(imgs.length>0){heroImg.src=imgs[0];heroImg.style.display="block";heroFb.style.display="none";}
  else{heroImg.style.display="none";heroFb.style.display="flex";heroFb.textContent=p.icon||"\uD83D\uDCC1";}
  document.getElementById("pd-title").textContent=p.title;
  document.getElementById("pd-subtitle").textContent=cats.map(function(c){return c.toUpperCase();}).join(" \u00B7 ");
  var stEl=document.getElementById("pd-status");
  stEl.className="pd-status "+(p.status==="done"?"b-done":"b-wip");
  stEl.innerHTML='<span class="b-dot"></span>'+(p.status==="done"?"COMPLETED":"IN PROGRESS");
  document.getElementById("pd-date").textContent=p.date||"";
  document.getElementById("pd-desc").innerHTML=p.desc;
  document.getElementById("pd-tags").innerHTML=(p.tags||[]).map(function(t){return '<span class="pd-tag">'+t+'</span>';}).join("");
  var gallerySection=document.getElementById("pd-gallery-section");
  if(gallerySection)gallerySection.style.display=(!isDevMode&&!imgs.length)?"none":"block";
  var gg=document.getElementById("pd-gallery-grid");gg.innerHTML="";
  if(imgs.length>0){
    imgs.forEach(function(src,i){
      var item=document.createElement("div");item.className="pd-gallery-item";
      item.innerHTML='<img src="'+src+'" alt="Project image '+(i+1)+'" loading="lazy">'+
        (isDevMode?'<button class="img-del" onclick="event.stopPropagation();deleteProjectImage('+i+')">&#x2715;</button>':'');
      item.onclick=function(){openLightbox(src);};
      gg.appendChild(item);
    });
  }else{
    gg.innerHTML='<div style="grid-column:1/-1;font-family:var(--fm);font-size:11px;color:var(--muted);padding:32px;text-align:center;border:1px dashed var(--border);border-radius:3px">'+(isDevMode?"No images yet \u2014 upload below.":"No images for this project yet.")+'</div>';
  }
  renderVideoPanel(p);
  renderModelPanel(p);
  var detail=document.getElementById("project-detail");
  detail.classList.add("open");detail.scrollTop=0;document.body.style.overflow="hidden";
}
function closeDetail(){document.getElementById("project-detail").classList.remove("open");document.body.style.overflow="";currentDetailId=null;stopModelViewer();}

async function uploadProjImgs(e){
  if(!isDevMode||!currentDetailId)return;
  var files=Array.from(e.target.files);
  var p=DB.projects.find(function(x){return x.id===currentDetailId;});if(!p)return;
  if(!p.images)p.images=[];
  try{
    var cropped=await cropFiles(files);
    cropped.forEach(function(src){p.images.push(src);});
    saveDB();openDetail(currentDetailId);toast("Images uploaded!");
  }catch(err){toast("Upload cancelled","err");}
  e.target.value="";
}

function deleteProjectImage(index){
  if(!isDevMode||!currentDetailId)return;
  var p=DB.projects.find(function(x){return x.id===currentDetailId;});if(!p||!p.images)return;
  if(!confirm("Delete this image?"))return;
  p.images.splice(index,1);
  saveDB();
  openDetail(currentDetailId);
  renderProjects("all");
  toast("Image deleted");
}

async function uploadProjectVideos(e){
  if(!isDevMode||!currentDetailId)return;
  var files=Array.from(e.target.files||[]).filter(function(file){return /^video\//i.test(file.type)||/\.(mp4|webm|mov|m4v)$/i.test(file.name);});
  var p=DB.projects.find(function(x){return x.id===currentDetailId;});if(!p)return;
  if(!p.videos)p.videos=[];
  try{
    for(var i=0;i<files.length;i++){
      if(files[i].size>VIDEO_MAX_FILE_BYTES&&!confirm(files[i].name+" cukup besar dan bisa membuat browser lambat. Tetap upload?"))continue;
      var src=await readFileAsDataURL(files[i]);
      p.videos.push({name:files[i].name,size:files[i].size,type:files[i].type||"video/mp4",src:src});
    }
    saveDB();
    openDetail(currentDetailId);
    renderProjects("all");
    toast("Video uploaded");
  }catch(err){toast("Failed to upload video","err");}
  e.target.value="";
}
function deleteProjectVideo(index){
  if(!isDevMode||!currentDetailId)return;
  var p=DB.projects.find(function(x){return x.id===currentDetailId;});if(!p||!p.videos)return;
  if(!confirm("Delete this video?"))return;
  p.videos.splice(index,1);
  saveDB();
  openDetail(currentDetailId);
  renderProjects("all");
  toast("Video deleted");
}
function renderVideoPanel(project){
  var section=document.getElementById("pd-video-section"),grid=document.getElementById("pd-video-grid");
  if(!grid)return;
  var videos=project.videos||[];
  if(section)section.style.display=(!isDevMode&&!videos.length)?"none":"block";
  grid.innerHTML="";
  if(!videos.length){
    grid.innerHTML='<div class="pd-video-empty">'+(isDevMode?"No videos yet — upload below.":"No videos for this project yet.")+'</div>';
    return;
  }
  videos.forEach(function(video,i){
    var src=typeof video==="string"?video:video.src;
    var name=(video&&video.name)||("Project video "+(i+1));
    var type=(video&&video.type)||"video/mp4";
    var item=document.createElement("div");
    item.className="pd-video-item";
    item.innerHTML='<video controls preload="metadata" playsinline><source src="'+src+'" type="'+type+'"></video>'+
      '<div class="pd-video-name">'+name+'</div>'+
      (isDevMode?'<button class="img-del" onclick="event.stopPropagation();deleteProjectVideo('+i+')">&#x2715;</button>':'');
    grid.appendChild(item);
  });
}

async function uploadProjectModels(e){
  if(!isDevMode||!currentDetailId)return;
  var files=Array.from(e.target.files||[]).filter(function(file){return /\.stl$/i.test(file.name);});
  var p=DB.projects.find(function(x){return x.id===currentDetailId;});if(!p)return;
  if(!p.models)p.models=[];
  try{
    for(var i=0;i<files.length;i++){
      if(files[i].size>MODEL_MAX_FILE_BYTES&&!confirm(files[i].name+" cukup besar dan bisa membuat viewer lag. Tetap upload?"))continue;
      var data=await readFileAsBase64(files[i]);
      p.models.push({name:files[i].name,size:files[i].size,data:data});
    }
    saveDB();
    openDetail(currentDetailId);
    renderProjects("all");
    toast("3D model uploaded");
  }catch(err){toast("Failed to upload STL","err");}
  e.target.value="";
}
function deleteProjectModel(index){
  if(!isDevMode||!currentDetailId)return;
  var p=DB.projects.find(function(x){return x.id===currentDetailId;});if(!p||!p.models)return;
  if(!confirm("Delete this 3D model?"))return;
  p.models.splice(index,1);
  saveDB();
  openDetail(currentDetailId);
  renderProjects("all");
  toast("3D model deleted");
}
function renderModelPanel(project){
  var list=document.getElementById("model-list"),empty=document.getElementById("model-empty");
  var section=document.getElementById("pd-model-section");
  if(!list)return;
  stopModelViewer();
  list.innerHTML="";
  var models=project.models||[];
  if(section)section.style.display=(!isDevMode&&!models.length)?"none":"block";
  if(!models.length){
    if(empty){empty.textContent=isDevMode?"No STL model yet. Upload one below.":"No 3D model for this project yet.";empty.style.display="flex";}
    return;
  }
  models.forEach(function(model,i){
    var btn=document.createElement("button");
    btn.className="model-chip"+(i===0?" active":"");
    btn.innerHTML='<span>'+model.name+'</span>'+(isDevMode?'<b onclick="event.stopPropagation();deleteProjectModel('+i+')">&#x2715;</b>':'');
    btn.onclick=function(){
      document.querySelectorAll(".model-chip").forEach(function(x){x.classList.remove("active");});
      btn.classList.add("active");
      showSTLModel(model);
    };
    list.appendChild(btn);
  });
  showSTLModel(models[0]);
}

function openLightbox(src){document.getElementById("lightbox-img").src=src;document.getElementById("lightbox").classList.add("open");}
function closeLightbox(){document.getElementById("lightbox").classList.remove("open");}
