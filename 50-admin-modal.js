function renderExp(){
  var el=document.getElementById("exp-list");el.innerHTML="";
  DB.experience.forEach(function(e,i){
    var d=document.createElement("div");d.className="exp-item reveal";d.style.transitionDelay=(i*50)+"ms";
    d.innerHTML=
      (isDevMode?'<button class="card-del" onclick="delItem(\'experience\','+e.id+')" style="top:12px;right:12px">&#x2715;</button>':'')+
      '<div class="exp-left"><div class="exp-per">'+e.period+'</div><div class="exp-org">'+e.org+'</div>'+(e.logo?'<img class="exp-logo" src="'+e.logo+'" alt="'+safeText(e.org)+' logo" loading="lazy">':'')+'</div>'+
      '<div class="exp-right"><div class="exp-role">'+e.role+'</div>'+
      '<ul class="exp-bul">'+(e.bullets||[]).map(function(b){return '<li>'+b+'</li>';}).join("")+'</ul>'+
      (isDevMode?'<button class="card-edit-btn" style="position:relative;margin-top:8px" onclick="openEdit(\'exp\','+e.id+')">&#x270E; Edit</button>':'')+
      '</div>';
    el.appendChild(d);
  });
}
function renderCerts(){
  var cg=document.getElementById("cert-grid");cg.innerHTML="";
  DB.certs=normalizeCerts(DB.certs||[]);
  DB.certs.forEach(function(c,i){
    var item=document.createElement("button");
    item.type="button";
    item.className="cert-card reveal";
    item.onclick=function(){openCertViewer(i);};
    var hasFile=!!c.file;
    item.innerHTML=(isDevMode?'<span class="cert-del" onclick="event.stopPropagation();deleteCert('+i+')">&#x2715;</span>':'')+
      '<span class="cert-ico">'+(hasFile?"\u25A3":"\u25CE")+'</span>'+
      '<span class="cert-name">'+safeText(c.name)+'</span>'+
      '<span class="cert-meta">'+(hasFile?"View certificate":"No file uploaded")+'</span>';
    cg.appendChild(item);
  });
  renderCertLink();
}
function renderCertLink(){
  var wrap=document.getElementById("cert-link-wrap");if(!wrap)return;
  var link=DB.certLink||{};
  var label=link.label||"View All Certificates";
  var href=link.href||"#certs";
  wrap.innerHTML='<div class="cert-link-row"><a href="'+safeText(href)+'" '+(link.target?'target="_blank" rel="noopener"':'')+' class="btn btn-ghost">'+safeText(label)+' &#x2197;</a>'+(isDevMode?'<button type="button" class="card-edit-btn cert-link-edit" onclick="openEditCertLink()">&#x270E; Edit Link</button>':'')+'</div>';
}
function normalizeCerts(list){
  return (list||[]).map(function(c,i){
    if(typeof c==="string")return {id:i+1,name:c,file:null};
    if(!c.id)c.id=i+1;
    if(!("file" in c))c.file=null;
    return c;
  });
}
function openCertViewer(index){
  var cert=(DB.certs||[])[index];if(!cert)return;
  if(cert.file&&cert.file.src){
    if(/^application\/pdf/i.test(cert.file.type||"")||/\.pdf$/i.test(cert.file.name||"")){
      window.open(cert.file.src,"_blank");
    }else{
      openLightbox(cert.file.src);
    }
  }else if(isDevMode){
    openEditCert(index);
  }else{
    toast("Certificate file belum tersedia","err");
  }
}
function openEditCert(index){
  if(!isDevMode)return;
  modalType="cert";editingId=index;
  buildForm("cert",(DB.certs||[])[index]||null);
  document.getElementById("modal-wrap").classList.add("open");
}
function openEditCertLink(){
  if(!isDevMode)return;
  modalType="certLink";editingId=null;
  buildForm("certLink",DB.certLink||{});
  document.getElementById("modal-wrap").classList.add("open");
}
function deleteCert(index){
  if(!isDevMode)return;
  var cert=(DB.certs||[])[index];if(!cert)return;
  if(!confirm('Delete certificate "'+(cert.name||"Certificate")+'"?'))return;
  DB.certs.splice(index,1);
  saveDB();renderCerts();toast("Certificate deleted");
}

function delItem(col,id){
  if(!confirm("Delete this item?"))return;
  DB[col]=DB[col].filter(function(x){return x.id!==id;});saveDB();
  if(col==="awards")renderAwards();
  else if(col==="skills")renderSkills();
  else if(col==="projects")renderProjects("all");
  else if(col==="experience")renderExp();
  renderTimeline();
  toast("Deleted");observe();
}

function openModal(type){if(!isDevMode){toast("Developer access only","err");return;}modalType=type;editingId=null;editingToolIcon=null;buildForm(type,null);document.getElementById("modal-wrap").classList.add("open");}
function openEdit(type,id){
  if(!isDevMode)return;modalType=type;editingId=id;var item=null;
  if(type==="award")item=DB.awards.find(function(x){return x.id===id;});
  else if(type==="skill")item=DB.skills.find(function(x){return x.id===id;});
  else if(type==="project")item=DB.projects.find(function(x){return x.id===id;});
  else if(type==="exp")item=DB.experience.find(function(x){return x.id===id;});
  else if(type==="profile")item=DB.profile;
  buildForm(type,item);document.getElementById("modal-wrap").classList.add("open");
}
function closeModal(){document.getElementById("modal-wrap").classList.remove("open");editingToolIcon=null;}
function closeModalOutside(e){if(e.target===document.getElementById("modal-wrap"))closeModal();}

function fi(id,lbl,ph,val,t){t=t||"text";return '<div class="mg"><label class="ml">'+lbl+'</label><input type="'+t+'" class="mi" id="mf-'+id+'" placeholder="'+ph+'" value="'+(val||"")+'"></div>';}
function fs(id,lbl,opts,val){return '<div class="mg"><label class="ml">'+lbl+'</label><select class="ms" id="mf-'+id+'">'+opts.map(function(o){return '<option value="'+o.v+'"'+(val===o.v?" selected":"")+'>'+o.l+'</option>';}).join("")+'</select></div>';}
function fa(id,lbl,ph,val){return '<div class="mg"><label class="ml">'+lbl+'</label><textarea class="mta" id="mf-'+id+'" placeholder="'+ph+'">'+(val||"")+'</textarea></div>';}

function buildForm(type,data){
  var titles={award:"Award",skill:"Icon / Tool",project:"Project",exp:"Experience",cert:"Certification",certLink:"Certificate Link",profile:"Edit Profile",contact:"Contact Link",contactAbout:"Contact Text"};
  document.getElementById("modal-title").textContent=(data&&type!=="cert"?"Edit ":"Add ")+titles[type];
  var b=document.getElementById("modal-body");b.innerHTML="";var d=data||{};
  if(type==="award"){b.innerHTML=fi("year","Year","2024",d.year)+fi("name","Award Name","Top 4 Competition",d.name)+fi("sub","Subtitle","Category \u00B7 Location",d.sub)+fs("type","Type",[{v:"intl",l:"\uD83C\uDF0D International"},{v:"natl",l:"\uD83C\uDDEE\uD83C\uDDE9 National"}],d.type||"natl");}
  else if(type==="skill"){
    b.innerHTML=fs("section","Icon Section",[{v:"software",l:"Software & Engineering Apps"},{v:"hardware",l:"Hardware & Frameworks"}],d.section||"software");
    b.innerHTML+=fi("tool","Icon / App Name","SolidWorks, MATLAB, OpenFOAM, Arduino",d.name||"");
    b.innerHTML+=fi("label","Display Label (optional)","SolidWorks",d.label||"");
    b.innerHTML+=fi("mono","Fallback Text (optional)","SW",d.mono||"");
    if(d.img){b.innerHTML+='<div class="mg"><label class="ml">Current Logo</label><div class="modal-img-grid"><div class="modal-img-item"><img src="'+d.img+'"></div></div></div>';}
    b.innerHTML+='<div class="mg"><label class="ml">Upload Logo / Photo (optional)</label><input type="file" class="mi" id="mf-logo" accept="image/*"><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Upload PNG/JPG/SVG kecil untuk logo custom. Jika kosong, sistem akan mencoba logo otomatis atau fallback text.</div></div>';
  }
  else if(type==="project"){
    b.innerHTML='<div class="mrow">'+fi("title","Project Title","Robot Dog",d.title)+fi("icon","Fallback Emoji (optional)","\uD83E\uDD16",d.icon)+'</div>';
    b.innerHTML+='<div class="mrow">'+fs("status","Status",[{v:"done",l:"\u2705 Completed"},{v:"wip",l:"\u23F3 In Progress"}],d.status)+fi("date","Date","JAN 2026",d.date)+'</div>';
    b.innerHTML+=fi("cats","Categories (comma separated)","robotics, competition",Array.isArray(d.cats)?d.cats.join(", "):(d.cats||""));
    b.innerHTML+=fa("desc","Description","Describe this project...",d.desc);
    b.innerHTML+=fi("tags","Tech Tags (comma separated)","ROS, Python, STM32",(d.tags||[]).join(", "));
    b.innerHTML+='<div class="mg"><label class="ml">Project Images / Thumbnail</label><input type="file" class="mi" id="mf-images" accept="image/*" multiple><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Setiap gambar akan masuk crop editor sebelum disimpan. Gambar pertama menjadi thumbnail card.</div></div>';
    if(d.images&&d.images.length){b.innerHTML+='<div class="mg"><label class="ml">Current Images</label><div class="modal-img-grid">'+d.images.map(function(src,i){return '<div class="modal-img-item"><img src="'+src+'"><button type="button" onclick="deleteModalProjectImage('+i+')">&#x2715;</button></div>';}).join("")+'</div><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6">Klik X untuk menghapus gambar lama.</div></div>';}
    b.innerHTML+='<div class="mg"><label class="ml">Project Videos</label><input type="file" class="mi" id="mf-videos" accept="video/mp4,video/webm,video/quicktime,video/*" multiple><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Upload video MP4, WEBM, atau MOV untuk ditampilkan di bawah gallery.</div></div>';
    if(d.videos&&d.videos.length){b.innerHTML+='<div class="mg"><label class="ml">Current Videos</label><div class="modal-model-list">'+d.videos.map(function(v,i){return '<button type="button" onclick="deleteModalProjectVideo('+i+')"><span>'+((v&&v.name)||("Project video "+(i+1)))+'</span><b>&#x2715;</b></button>';}).join("")+'</div></div>';}
    b.innerHTML+='<div class="mg"><label class="ml">3D Models (STL)</label><input type="file" class="mi" id="mf-models" accept=".stl,model/stl" multiple><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Upload file .stl ASCII/Binary untuk ditampilkan di viewer 3D project.</div></div>';
    if(d.models&&d.models.length){b.innerHTML+='<div class="mg"><label class="ml">Current 3D Models</label><div class="modal-model-list">'+d.models.map(function(m,i){return '<button type="button" onclick="deleteModalProjectModel('+i+')"><span>'+m.name+'</span><b>&#x2715;</b></button>';}).join("")+'</div></div>';}
  }else if(type==="exp"){
    b.innerHTML=fi("period","Period","Nov 2025 \u2013 Present",d.period)+fi("org","Organization","PT. Kalbe Morinaga",d.org)+fi("role","Role","CAE Engineer Intern",d.role);
    if(d.logo){b.innerHTML+='<div class="mg"><label class="ml">Current Company Logo</label><div class="modal-img-grid"><div class="modal-img-item"><img src="'+d.logo+'"><button type="button" onclick="deleteExperienceLogo()">&#x2715;</button></div></div></div>';}
    b.innerHTML+='<div class="mg"><label class="ml">Company Logo</label><input type="file" class="mi" id="mf-logo" accept="image/*"><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Upload logo perusahaan untuk ditampilkan di bawah nama organisasi.</div></div>';
    b.innerHTML+=fa("bullets","Bullet Points (one per line)","Structural Analysis (FEA)",(d.bullets||[]).join("\n"));
  }else if(type==="cert"){
    b.innerHTML=fi("name","Certificate Name","Electric Prototype SEM 2026",d.name||"");
    if(d.file&&d.file.src){b.innerHTML+='<div class="mg"><label class="ml">Current Certificate</label><div class="modal-model-list"><button type="button" onclick="openCertViewer('+editingId+')"><span>'+safeText(d.file.name||"Certificate file")+'</span><b>VIEW</b></button></div></div>';}
    b.innerHTML+='<div class="mg"><label class="ml">Upload Certificate File</label><input type="file" class="mi" id="mf-cert-file" accept="image/*,application/pdf,.pdf"><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Upload gambar atau PDF sertifikat. Klik icon sertifikat di website untuk melihat file.</div></div>';
  }else if(type==="certLink"){
    b.innerHTML=fi("label","Button Text","View All Certificates",d.label||"View All Certificates");
    b.innerHTML+=fi("href","Certificate Link","https://drive.google.com/...",d.href||"");
    b.innerHTML+=fs("target","Open Target",[{v:"true",l:"New tab"},{v:"false",l:"Same tab"}],String(d.target!==false));
  }
  else if(type==="contact"){
    b.innerHTML='<div class="mrow">'+fi("icon","Icon","@",d.icon)+fi("label","Label","EMAIL",d.label)+'</div>';
    b.innerHTML+=fi("value","Display Value","christofer.wijaya@binus.ac.id",d.value);
    b.innerHTML+=fi("href","Link / URL","mailto:christofer.wijaya@binus.ac.id",d.href);
    b.innerHTML+=fs("target","Open Target",[{v:"false",l:"Same tab"},{v:"true",l:"New tab"}],String(!!d.target));
    if(d.type==="cv")b.innerHTML+='<div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Untuk file CV, klik tombol Download CV saat Dev Mode untuk upload/ganti/hapus PDF.</div>';
  }
  else if(type==="contactAbout"){
    b.innerHTML=fa("content","Contact About Text","Use <p>Text</p> and <strong>bold</strong> if needed.",d.content||"");
    b.innerHTML+='<div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Bisa pakai HTML sederhana: &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;. Hindari script atau style yang aneh.</div>';
  }
  else if(type==="profile"){
    b.innerHTML='<div class="mrow">'+fi("fname","First Name","CHRISTOFER",d.fname)+fi("lname","Last Name","REY WIJAYA",d.lname)+'</div>';
    b.innerHTML+=fi("role","Title","Robotics & Automotive Engineer",d.role)+fi("school","School","Binus University",d.school)+fi("gpa","GPA","3.53",d.gpa);
    b.innerHTML+=fa("desc","Bio","Your bio...",d.desc);
  }
}
function v(id){var el=document.getElementById("mf-"+id);return el?el.value.trim():"";}

function deleteModalProjectImage(index){
  if(modalType!=="project"||!editingId)return;
  var p=DB.projects.find(function(x){return x.id===editingId;});if(!p||!p.images)return;
  if(!confirm("Delete this image?"))return;
  p.images.splice(index,1);
  saveDB();
  buildForm("project",p);
  renderProjects("all");
  toast("Image deleted");
}
function deleteModalProjectVideo(index){
  if(modalType!=="project"||!editingId)return;
  var p=DB.projects.find(function(x){return x.id===editingId;});if(!p||!p.videos)return;
  if(!confirm("Delete this video?"))return;
  p.videos.splice(index,1);
  saveDB();
  buildForm("project",p);
  renderProjects("all");
  toast("Video deleted");
}
function deleteModalProjectModel(index){
  if(modalType!=="project"||!editingId)return;
  var p=DB.projects.find(function(x){return x.id===editingId;});if(!p||!p.models)return;
  if(!confirm("Delete this 3D model?"))return;
  p.models.splice(index,1);
  saveDB();
  buildForm("project",p);
  renderProjects("all");
  toast("3D model deleted");
}
function deleteExperienceLogo(){
  if(modalType!=="exp"||!editingId)return;
  var e=DB.experience.find(function(x){return x.id===editingId;});if(!e)return;
  if(!confirm("Delete company logo?"))return;
  delete e.logo;
  saveDB();
  buildForm("exp",e);
  renderExp();
  toast("Company logo deleted");
}

async function saveModal(){
  if(modalType==="award"){
    var item={id:editingId||nextId(DB.awards),year:v("year"),name:v("name"),sub:v("sub"),type:v("type")};
    if(!item.name){toast("Name required","err");return;}
    if(editingId){var i=DB.awards.findIndex(function(x){return x.id===editingId;});DB.awards[i]=item;}else DB.awards.push(item);
    saveDB();renderAwards();renderTimeline();
  }else if(modalType==="skill"){
    var tool=v("tool"),label=v("label"),mono=v("mono"),section=v("section")||"software";
    if(!tool){toast("Icon name required","err");return;}
    var value=label?label:tool;
    var key=section==="hardware"?"hardwareTools":"softwareTools";
    if(editingToolIcon){
      var oldKey=editingToolIcon.section==="hardware"?"hardwareTools":"softwareTools";
      DB[oldKey]=(DB[oldKey]||[]).filter(function(t){return t!==editingToolIcon.name;});
      if(DB.toolIcons&&editingToolIcon.name!==value)delete DB.toolIcons[editingToolIcon.name];
    }
    if(!Array.isArray(DB[key]))DB[key]=[];
    if(!DB[key].includes(value))DB[key].push(value);
    if(!DB.tools.includes(value))DB.tools.push(value);
    var logoInput=document.getElementById("mf-logo");
    var logoFile=logoInput&&logoInput.files&&logoInput.files[0];
    DB.toolIcons=DB.toolIcons||{};
    var meta={mono:mono||String(value).slice(0,3),label:value};
    if(logoFile){
      if(logoFile.size>1200000&&!confirm("Logo cukup besar dan bisa membuat database berat. Tetap upload?"))return;
      meta.img=await readFileAsDataURL(logoFile);
    }else if(editingToolIcon&&DB.toolIcons&&DB.toolIcons[editingToolIcon.name]&&DB.toolIcons[editingToolIcon.name].img){
      meta.img=DB.toolIcons[editingToolIcon.name].img;
    }
    if(mono||logoFile||meta.img)DB.toolIcons[value]=meta;
    saveDB();renderSkills();
  }else if(modalType==="project"){
    var cats=v("cats").split(",").map(function(s){return s.trim();}).filter(Boolean);
    var tags=v("tags").split(",").map(function(s){return s.trim();}).filter(Boolean);
    var existing=editingId?DB.projects.find(function(x){return x.id===editingId;}):null;
    var item={id:editingId||nextId(DB.projects),title:v("title"),icon:v("icon")||"\uD83D\uDCC1",status:v("status"),date:v("date"),cats:cats,desc:v("desc"),tags:tags,images:existing?existing.images||[]:[],videos:existing?existing.videos||[]:[],models:existing?existing.models||[]:[]};
    if(!item.title){toast("Title required","err");return;}
    var imgInput=document.getElementById("mf-images");
    var files=imgInput?Array.from(imgInput.files):[];
    var videoInput=document.getElementById("mf-videos");
    var videoFiles=videoInput?Array.from(videoInput.files).filter(function(file){return /^video\//i.test(file.type)||/\.(mp4|webm|mov|m4v)$/i.test(file.name);}):[];
    var modelInput=document.getElementById("mf-models");
    var modelFiles=modelInput?Array.from(modelInput.files).filter(function(file){return /\.stl$/i.test(file.name);}):[];
    function finishProjectSave(){
      if(editingId){var i=DB.projects.findIndex(function(x){return x.id===editingId;});DB.projects[i]=item;}else DB.projects.push(item);
      saveDB();renderProjects("all");renderTimeline();toast("Project saved!");closeModal();
    }
    if(files.length){
      try{
        var cropped=await cropFiles(files);
        cropped.forEach(function(src){item.images.push(src);});
      }catch(err){
        toast("Image crop cancelled","err");
        return;
      }
    }
    if(videoFiles.length){
      for(var vi=0;vi<videoFiles.length;vi++){
        if(videoFiles[vi].size>VIDEO_MAX_FILE_BYTES&&!confirm(videoFiles[vi].name+" cukup besar dan bisa membuat browser lambat. Tetap upload?"))continue;
        var videoSrc=await readFileAsDataURL(videoFiles[vi]);
        item.videos.push({name:videoFiles[vi].name,size:videoFiles[vi].size,type:videoFiles[vi].type||"video/mp4",src:videoSrc});
      }
    }
    if(modelFiles.length){
      for(var mi=0;mi<modelFiles.length;mi++){
        if(modelFiles[mi].size>MODEL_MAX_FILE_BYTES&&!confirm(modelFiles[mi].name+" cukup besar dan bisa membuat viewer lag. Tetap upload?"))continue;
        var modelData=await readFileAsBase64(modelFiles[mi]);
        item.models.push({name:modelFiles[mi].name,size:modelFiles[mi].size,data:modelData});
      }
    }
    finishProjectSave();
    return;
  }else if(modalType==="exp"){
    var bullets=v("bullets").split("\n").map(function(s){return s.trim();}).filter(Boolean);
    var existing=editingId?DB.experience.find(function(x){return x.id===editingId;}):null;
    var item={id:editingId||nextId(DB.experience),period:v("period"),org:v("org"),role:v("role"),bullets:bullets,logo:existing?existing.logo||"":""};
    if(!item.role){toast("Role required","err");return;}
    var logoInput=document.getElementById("mf-logo");
    var logoFile=logoInput&&logoInput.files&&logoInput.files[0];
    if(logoFile){
      if(logoFile.size>1200000&&!confirm("Logo cukup besar dan bisa membuat database berat. Tetap upload?"))return;
      try{
        item.logo=await cropFile(logoFile,{width:1024,height:1024,mime:"image/png",quality:0.96,title:"Crop Company Logo",sub:"Drag image, adjust zoom, then save as a clean 1024x1024 logo"});
      }catch(err){
        toast("Logo crop cancelled","err");
        return;
      }
    }
    if(editingId){var i=DB.experience.findIndex(function(x){return x.id===editingId;});DB.experience[i]=item;}else DB.experience.push(item);
    saveDB();renderExp();renderTimeline();
  }else if(modalType==="cert"){
    var n=v("name");if(!n){toast("Name required","err");return;}
    DB.certs=normalizeCerts(DB.certs||[]);
    var fileInput=document.getElementById("mf-cert-file");
    var file=fileInput&&fileInput.files&&fileInput.files[0];
    var existing=editingId!==null&&editingId!==undefined?DB.certs[editingId]:null;
    var cert={id:existing?existing.id:Date.now(),name:n,file:existing?existing.file:null};
    if(file){
      if(file.size>5000000&&!confirm("File sertifikat lebih dari 5MB dan bisa membuat database berat. Tetap upload?"))return;
      cert.file={name:file.name,size:file.size,type:file.type||"",src:await readFileAsDataURL(file)};
    }
    if(editingId!==null&&editingId!==undefined)DB.certs[editingId]=cert;else DB.certs.push(cert);
    saveDB();renderCerts();
  }else if(modalType==="certLink"){
    DB.certLink={label:v("label")||"View All Certificates",href:v("href")||"#certs",target:v("target")!=="false"};
    saveDB();renderCerts();
  }else if(modalType==="contact"){
    var item=(DB.contactLinks||[]).find(function(x){return x.id===editingId;});
    if(!item){toast("Contact item not found","err");return;}
    item.icon=v("icon");item.label=v("label");item.value=v("value");item.href=v("href");item.target=v("target")==="true";
    saveDB();renderContactLinks();renderCVLinks();
  }else if(modalType==="contactAbout"){
    DB.contactAbout=v("content")||DEFAULT.contactAbout||"";
    saveDB();renderContactAbout();
  }else if(modalType==="profile"){
    DB.profile={fname:v("fname"),lname:v("lname"),role:v("role"),school:v("school"),gpa:v("gpa"),desc:v("desc")};
    saveDB();renderProfile();renderStats();
  }
  toast(editingId?"Updated!":"Added!");closeModal();setTimeout(observe,150);
}
function resetAll(){if(!confirm("Reset semua data ke default?"))return;localStorage.removeItem(SK);loadDB();renderAll();toast("Data reset");}
