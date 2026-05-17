function exportDatabase(){
  var payload={
    app:"crw-portfolio",
    version:9,
    exportedAt:new Date().toISOString(),
    data:DB
  };
  var blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");
  var stamp=new Date().toISOString().slice(0,10);
  a.href=url;
  a.download="crw-portfolio-database-"+stamp+".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("Database exported");
}
function importDatabase(e){
  var file=e.target.files&&e.target.files[0];
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    try{
      var parsed=JSON.parse(ev.target.result);
      var imported=parsed.data||parsed;
      if(!imported||typeof imported!=="object"||!Array.isArray(imported.projects)){
        throw new Error("Invalid database file");
      }
      if(!confirm("Import database ini? Data browser saat ini akan diganti."))return;
      DB=mergeImportedDB(imported);
      saveDB();
      renderAll();
      if(currentDetailId)openDetail(currentDetailId);
      toast("Database imported");
    }catch(err){
      toast("Invalid database file","err");
    }finally{
      e.target.value="";
    }
  };
  reader.readAsText(file);
}
function mergeImportedDB(imported){
  var base=freshDefault();
  var merged=Object.assign(base,imported);
  merged.profile=Object.assign(base.profile,imported.profile||{});
  merged.sync=Object.assign({},base.sync||{},imported.sync||{});
  merged.cvFile=imported.cvFile||base.cvFile||null;
  merged.contactAbout=imported.contactAbout||base.contactAbout;
  merged.certLink=Object.assign({},base.certLink||{},imported.certLink||{});
  merged.toolIcons=Object.assign({},base.toolIcons||{},imported.toolIcons||{});
  ["awards","skills","tools","softwareTools","hardwareTools","contactLinks","projects","experience","certs"].forEach(function(key){
    if(!Array.isArray(merged[key]))merged[key]=base[key];
  });
  merged.projects=merged.projects.map(function(p){
    if(!Array.isArray(p.images))p.images=[];
    if(!Array.isArray(p.videos))p.videos=[];
    if(!Array.isArray(p.models))p.models=[];
    return p;
  });
  return merged;
}

function getGitHubSyncConfig(){
  var host=location.hostname||"";
  var pathParts=(location.pathname||"").split("/").filter(Boolean);
  var owner=(host.match(/^(.+)\.github\.io$/)||[])[1]||"wijayarey577-commits";
  var repo=pathParts[0]||"web_potofolio1";
  var sync=DB.sync||DEFAULT.sync||{};
  return {owner:owner,repo:repo,branch:sync.branch||"main",path:sync.path||"portfolio-data.json"};
}
async function resolveGitHubSyncConfig(token){
  var cfg=getGitHubSyncConfig();
  try{
    var headers={Accept:"application/vnd.github+json"};
    if(token)headers.Authorization="Bearer "+token;
    var res=await fetch("https://api.github.com/repos/"+cfg.owner+"/"+cfg.repo,{headers:headers});
    if(res.ok){
      var info=await res.json();
      if(info.default_branch)cfg.branch=info.default_branch;
    }
  }catch(err){}
  return cfg;
}
function remoteRawUrl(){
  var c=getGitHubSyncConfig();
  return "https://raw.githubusercontent.com/"+c.owner+"/"+c.repo+"/"+c.branch+"/"+c.path+"?v="+Date.now();
}
async function githubErrorMessage(res){
  try{
    var data=await res.json();
    if(data&&data.message)return data.message;
  }catch(err){}
  return "HTTP "+res.status;
}
async function loadRemoteDatabase(silent){
  try{
    var cfg=await resolveGitHubSyncConfig("");
    var url="https://raw.githubusercontent.com/"+cfg.owner+"/"+cfg.repo+"/"+cfg.branch+"/"+cfg.path+"?v="+Date.now();
    var res=await fetch(url,{cache:"no-store"});
    if(!res.ok)throw new Error("Remote database not found");
    var parsed=await res.json();
    var imported=parsed.data||parsed;
    var remoteTime=Date.parse(imported.updatedAt||parsed.exportedAt||0);
    var localTime=Date.parse(DB.updatedAt||0);
    if(silent&&localTime&&remoteTime&&localTime>remoteTime)return;
    DB=mergeImportedDB(imported);
    saveDB(true);
    renderAll();
    if(currentDetailId)openDetail(currentDetailId);
    if(!silent)toast("Cloud database loaded");
  }catch(err){
    if(!silent)toast("Cloud database belum tersedia atau gagal dibaca","err");
  }
}
function jsonToBase64(obj){
  var text=JSON.stringify({app:"crw-portfolio",version:9,exportedAt:new Date().toISOString(),data:obj},null,2);
  var bytes=new TextEncoder().encode(text),bin="";
  bytes.forEach(function(b){bin+=String.fromCharCode(b);});
  return btoa(bin);
}
async function publishDatabaseToGitHub(){
  if(!isDevMode){toast("Developer access only","err");return;}
  var cfg=getGitHubSyncConfig();
  var token=localStorage.getItem(GH_TOKEN_KEY)||"";
  if(!token){
    token=prompt("Masukkan GitHub token dengan akses Contents: Read and write untuk repo "+cfg.repo);
    if(!token){toast("Publish dibatalkan","err");return;}
    if(confirm("Simpan token di browser ini supaya publish berikutnya tidak perlu input ulang?"))localStorage.setItem(GH_TOKEN_KEY,token);
  }
  cfg=await resolveGitHubSyncConfig(token);
  DB.updatedAt=new Date().toISOString();
  var api="https://api.github.com/repos/"+cfg.owner+"/"+cfg.repo+"/contents/"+cfg.path;
  try{
    var sha=null;
    var current=await fetch(api+"?ref="+encodeURIComponent(cfg.branch),{headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json"}});
    if(current.ok){
      var meta=await current.json();
      sha=meta.sha;
    }else if(current.status!==404){
      throw new Error(await githubErrorMessage(current));
    }
    var body={message:"Update portfolio database",branch:cfg.branch,content:jsonToBase64(DB)};
    if(sha)body.sha=sha;
    var put=await fetch(api,{method:"PUT",headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!put.ok)throw new Error(await githubErrorMessage(put));
    saveDB(true);
    toast("Published to GitHub. Refresh browser lain dalam 1-2 menit.");
  }catch(err){
    var msg=(err&&err.message)||"Cek token, repo, dan branch GitHub.";
    toast("Publish gagal: "+msg,"err");
    alert("Publish GitHub gagal:\n\n"+msg+"\n\nPastikan token punya permission Contents: Read and write untuk repo "+cfg.owner+"/"+cfg.repo+" dan belum expired.");
  }
}

function readFileAsDataURL(file){
  return new Promise(function(resolve,reject){
    var reader=new FileReader();
    reader.onload=function(ev){resolve(ev.target.result);};
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}
function readFileAsBase64(file){
  return new Promise(function(resolve,reject){
    var reader=new FileReader();
    reader.onload=function(ev){
      var bytes=new Uint8Array(ev.target.result),bin="";
      for(var i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);
      resolve(btoa(bin));
    };
    reader.onerror=reject;
    reader.readAsArrayBuffer(file);
  });
}
function base64ToArrayBuffer(data){
  var bin=atob(data),buf=new ArrayBuffer(bin.length),bytes=new Uint8Array(buf);
  for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  return buf;
}
function cropFiles(files,options){
  return files.reduce(function(chain,file){
    return chain.then(function(list){
      return cropFile(file,options).then(function(src){list.push(src);return list;});
    });
  },Promise.resolve([]));
}
function cropFile(file,options){
  options=options||{};
  return new Promise(function(resolve,reject){
    readFileAsDataURL(file).then(function(src){
      var img=new Image();
      img.onload=function(){
        cropState={
          img:img,src:src,resolve:resolve,reject:reject,
          zoom:1,offsetX:0,offsetY:0,drag:false,lastX:0,lastY:0,
          width:options.width||1920,
          height:options.height||1080,
          mime:options.mime||"image/jpeg",
          quality:options.quality||0.96
        };
        var wrap=document.getElementById("crop-wrap"),zoom=document.getElementById("crop-zoom");
        var canvas=document.getElementById("crop-canvas");
        var title=document.getElementById("crop-title");
        var sub=document.getElementById("crop-sub");
        if(title)title.textContent=options.title||"Crop Project Image";
        if(sub)sub.textContent=options.sub||"Drag image, adjust zoom, then save in HD 1920x1080";
        if(canvas){
          canvas.width=cropState.width;
          canvas.height=cropState.height;
          canvas.style.aspectRatio=cropState.width+" / "+cropState.height;
        }
        if(zoom){zoom.value=1;zoom.oninput=function(){cropState.zoom=parseFloat(this.value)||1;drawCrop();};}
        wrap.classList.add("open");
        initCropCanvas();
        drawCrop();
      };
      img.onerror=reject;
      img.src=src;
    }).catch(reject);
  });
}
function initCropCanvas(){
  var canvas=document.getElementById("crop-canvas");if(!canvas)return;
  canvas.onpointerdown=function(e){if(!cropState)return;cropState.drag=true;cropState.lastX=e.clientX;cropState.lastY=e.clientY;canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=function(e){
    if(!cropState||!cropState.drag)return;
    cropState.offsetX+=e.clientX-cropState.lastX;
    cropState.offsetY+=e.clientY-cropState.lastY;
    cropState.lastX=e.clientX;cropState.lastY=e.clientY;
    drawCrop();
  };
  canvas.onpointerup=function(e){if(!cropState)return;cropState.drag=false;try{canvas.releasePointerCapture(e.pointerId);}catch(err){}};
  canvas.onpointerleave=function(){if(cropState)cropState.drag=false;};
}
function drawCrop(){
  var canvas=document.getElementById("crop-canvas");if(!canvas||!cropState)return;
  var ctx=canvas.getContext("2d"),img=cropState.img,w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#0b0f14";ctx.fillRect(0,0,w,h);
  var p=getCropParams(w,h);
  ctx.drawImage(img,p.x,p.y,p.iw,p.ih);
  ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=2;ctx.strokeRect(1,1,w-2,h-2);
}
function getCropParams(w,h){
  var img=cropState.img;
  var base=Math.max(w/img.width,h/img.height);
  var scale=base*cropState.zoom;
  var iw=img.width*scale,ih=img.height*scale;
  var maxX=Math.max(0,(iw-w)/2),maxY=Math.max(0,(ih-h)/2);
  cropState.offsetX=Math.max(-maxX,Math.min(maxX,cropState.offsetX));
  cropState.offsetY=Math.max(-maxY,Math.min(maxY,cropState.offsetY));
  return {iw:iw,ih:ih,x:(w-iw)/2+cropState.offsetX,y:(h-ih)/2+cropState.offsetY};
}
function saveCrop(){
  if(!cropState)return;
  var canvas=document.createElement("canvas");
  canvas.width=cropState.width||1920;canvas.height=cropState.height||1080;
  var ctx=canvas.getContext("2d");
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
  ctx.fillStyle="#0b0f14";ctx.fillRect(0,0,canvas.width,canvas.height);
  var p=getCropParams(canvas.width,canvas.height);
  ctx.drawImage(cropState.img,p.x,p.y,p.iw,p.ih);
  var out=canvas.toDataURL(cropState.mime||"image/jpeg",cropState.quality||0.96);
  var resolve=cropState.resolve;
  closeCrop();
  resolve(out);
}
function skipCrop(){
  if(!cropState)return;
  var resolve=cropState.resolve,src=cropState.src;
  closeCrop();
  resolve(src);
}
function cancelCrop(){
  if(!cropState)return;
  var reject=cropState.reject;
  closeCrop();
  reject(new Error("cancelled"));
}
function closeCrop(){
  var wrap=document.getElementById("crop-wrap");if(wrap)wrap.classList.remove("open");
  cropState=null;
}

function showSTLModel(model){
  var empty=document.getElementById("model-empty");
  if(empty)empty.style.display="none";
  try{
    var tris=parseSTL(base64ToArrayBuffer(model.data));
    if(!tris.length)throw new Error("empty model");
    var originalCount=tris.length;
    tris=decimateTriangles(tris,MODEL_MAX_TRIANGLES);
    startModelViewer(tris);
    if(originalCount>tris.length)toast("Large STL optimized for preview");
  }catch(err){
    stopModelViewer();
    if(empty){empty.textContent="Failed to read STL model.";empty.style.display="flex";}
  }
}
function decimateTriangles(tris,maxCount){
  if(tris.length<=maxCount)return tris;
  var step=Math.ceil(tris.length/maxCount),out=[];
  for(var i=0;i<tris.length;i+=step)out.push(tris[i]);
  return out;
}
function parseSTL(buffer){
  var view=new DataView(buffer),bytes=new Uint8Array(buffer);
  var header="";
  for(var i=0;i<Math.min(80,bytes.length);i++)header+=String.fromCharCode(bytes[i]);
  var possibleCount=bytes.length>=84?view.getUint32(80,true):0;
  if(84+possibleCount*50===bytes.length)return parseBinarySTL(view,possibleCount);
  var text=new TextDecoder().decode(bytes);
  return parseAsciiSTL(text);
}
function parseBinarySTL(view,count){
  var tris=[],o=84;
  for(var i=0;i<count;i++){
    o+=12;
    var tri=[];
    for(var v=0;v<3;v++){
      tri.push({x:view.getFloat32(o,true),y:view.getFloat32(o+4,true),z:view.getFloat32(o+8,true)});
      o+=12;
    }
    tris.push(tri);o+=2;
  }
  return normalizeTriangles(tris);
}
function parseAsciiSTL(text){
  var nums=[],re=/vertex\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)/g,m;
  while((m=re.exec(text))){nums.push({x:parseFloat(m[1]),y:parseFloat(m[2]),z:parseFloat(m[3])});}
  var tris=[];
  for(var i=0;i+2<nums.length;i+=3)tris.push([nums[i],nums[i+1],nums[i+2]]);
  return normalizeTriangles(tris);
}
function normalizeTriangles(tris){
  if(!tris.length)return tris;
  var min={x:Infinity,y:Infinity,z:Infinity},max={x:-Infinity,y:-Infinity,z:-Infinity};
  tris.forEach(function(t){t.forEach(function(p){min.x=Math.min(min.x,p.x);min.y=Math.min(min.y,p.y);min.z=Math.min(min.z,p.z);max.x=Math.max(max.x,p.x);max.y=Math.max(max.y,p.y);max.z=Math.max(max.z,p.z);});});
  var cx=(min.x+max.x)/2,cy=(min.y+max.y)/2,cz=(min.z+max.z)/2;
  var s=Math.max(max.x-min.x,max.y-min.y,max.z-min.z)||1;
  return tris.map(function(t){return t.map(function(p){return {x:(p.x-cx)/s,y:(p.y-cy)/s,z:(p.z-cz)/s};});});
}
function startModelViewer(tris){
  stopModelViewer();
  var canvas=document.getElementById("model-canvas");if(!canvas)return;
  var ctx=canvas.getContext("2d");
  modelState={tris:tris,canvas:canvas,ctx:ctx,rotY:-0.72,rotX:-0.5,rotZ:0,auto:true,drag:false,lastX:0,lastY:0,raf:null,last:0};
  initModelControls(canvas);
  function loop(ts){
    if(ts-modelState.last<66){modelState.raf=requestAnimationFrame(loop);return;}
    modelState.last=ts;
    drawModel();
    if(modelState.auto)modelState.rotY+=0.028;
    modelState.raf=requestAnimationFrame(loop);
  }
  loop();
}
function initModelControls(canvas){
  canvas.onpointerdown=function(e){
    if(!modelState)return;
    modelState.drag=true;modelState.auto=false;modelState.lastX=e.clientX;modelState.lastY=e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  canvas.onpointermove=function(e){
    if(!modelState||!modelState.drag)return;
    var dx=e.clientX-modelState.lastX,dy=e.clientY-modelState.lastY;
    modelState.rotY+=dx*0.01;
    modelState.rotX=Math.max(-1.35,Math.min(1.35,modelState.rotX+dy*0.01));
    modelState.lastX=e.clientX;modelState.lastY=e.clientY;
    drawModel();
  };
  canvas.onpointerup=function(e){
    if(!modelState)return;
    modelState.drag=false;
    try{canvas.releasePointerCapture(e.pointerId);}catch(err){}
  };
  canvas.onpointerleave=function(){if(modelState)modelState.drag=false;};
  canvas.ondblclick=function(){if(modelState){modelState.auto=!modelState.auto;}};
}
function stopModelViewer(){
  if(modelState&&modelState.raf)cancelAnimationFrame(modelState.raf);
  modelState=null;
}
function setModelView(axis){
  if(!modelState)return;
  modelState.auto=false;
  modelState.rotZ=0;
  if(axis==="x"){modelState.rotY=Math.PI/2;modelState.rotX=0;}
  else if(axis==="y"){modelState.rotY=0;modelState.rotX=-Math.PI/2;}
  else if(axis==="z"){modelState.rotY=0;modelState.rotX=0;}
  else{modelState.rotY=-0.72;modelState.rotX=-0.5;modelState.rotZ=-0.08;}
  drawModel();
}
function tiltModel(dir){
  if(!modelState)return;
  modelState.auto=false;
  modelState.rotZ+=dir*0.18;
  drawModel();
}
function toggleModelAuto(){
  if(!modelState)return;
  modelState.auto=!modelState.auto;
}
function drawModel(){
  if(!modelState)return;
  var c=modelState.canvas,ctx=modelState.ctx,w=c.width,h=c.height,rotY=modelState.rotY,rotX=modelState.rotX,rotZ=modelState.rotZ||0;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--apple-bg2")||"#080d13";
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(10,132,255,.18)";
  ctx.lineWidth=1;
  for(var gx=0;gx<w;gx+=48){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}
  for(var gy=0;gy<h;gy+=48){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}
  var light={x:-.4,y:-.7,z:.8};
  var faces=modelState.tris.map(function(t){
    var pts=t.map(function(p){return rotatePoint(p,rotY,rotX,rotZ);});
    var z=(pts[0].z+pts[1].z+pts[2].z)/3;
    return {pts:pts,z:z};
  });
  if(faces.length<9000)faces.sort(function(a,b){return a.z-b.z;});
  faces.forEach(function(face){
    var pts=face.pts,normal=cross(sub(pts[1],pts[0]),sub(pts[2],pts[0]));
    var len=Math.hypot(normal.x,normal.y,normal.z)||1;
    var shade=Math.max(.18,(normal.x/len*light.x+normal.y/len*light.y+normal.z/len*light.z));
    var projected=pts.map(function(p){return projectPoint(p,w,h);});
    ctx.beginPath();ctx.moveTo(projected[0].x,projected[0].y);ctx.lineTo(projected[1].x,projected[1].y);ctx.lineTo(projected[2].x,projected[2].y);ctx.closePath();
    var a=0.46+shade*.42;
    ctx.fillStyle="rgba(10,132,255,"+a+")";ctx.fill();
  });
  ctx.fillStyle="rgba(255,255,255,.62)";
  ctx.font="12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Drag to tilt - click X/Y/Z for axis view - double click for auto rotate",18,h-18);
  drawAxisGizmo(ctx,w,h,rotY,rotX,rotZ);
}
function rotatePoint(p,ay,ax,az){
  var ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
  var x=p.x*ca-p.z*sa,z=p.x*sa+p.z*ca,y=p.y;
  var y2=y*cb-z*sb,z2=y*sb+z*cb;
  var cc=Math.cos(az||0),sc=Math.sin(az||0);
  return {x:x*cc-y2*sc,y:x*sc+y2*cc,z:z2};
}
function drawAxisGizmo(ctx,w,h,rotY,rotX,rotZ){
  var origin={x:w-72,y:72},axes=[
    {label:"X",color:"#ff453a",p:{x:.55,y:0,z:0}},
    {label:"Y",color:"#30d158",p:{x:0,y:.55,z:0}},
    {label:"Z",color:"#0a84ff",p:{x:0,y:0,z:.55}}
  ];
  ctx.save();
  ctx.lineWidth=2;
  axes.forEach(function(axis){
    var p=rotatePoint(axis.p,rotY,rotX,rotZ),x=origin.x+p.x*56,y=origin.y-p.y*56;
    ctx.strokeStyle=axis.color;ctx.fillStyle=axis.color;
    ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(x,y);ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    ctx.font="700 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(axis.label,x+6,y+4);
  });
  ctx.restore();
}
function projectPoint(p,w,h){
  var d=2.4,scale=Math.min(w,h)*.82/(d+p.z);
  return {x:w/2+p.x*scale,y:h/2-p.y*scale};
}
function sub(a,b){return {x:a.x-b.x,y:a.y-b.y,z:a.z-b.z};}
function cross(a,b){return {x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x};}
