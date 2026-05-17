function renderAll(){
  renderProfile();renderStats();renderAwards();renderSkills();
  renderProjects("all");renderExp();renderCerts();renderTimeline();renderContactAbout();renderContactLinks();renderCVLinks();
  setTimeout(observe,80);
}
function renderProfile(){
  var p=DB.profile;
  setText("h-fname",p.fname||DEFAULT.profile.fname);
  setText("h-lname",p.lname||DEFAULT.profile.lname);
  setHtml("h-role",p.role||DEFAULT.profile.role);
  setText("h-school",p.school||DEFAULT.profile.school);
  setHtml("h-desc",p.desc||DEFAULT.profile.desc);
  setText("h-gpa",p.gpa||DEFAULT.profile.gpa);
  bindHeroBioEditor();
}
function setText(id,value){var el=document.getElementById(id);if(el)el.textContent=value||"";}
function setHtml(id,value){var el=document.getElementById(id);if(el)el.innerHTML=value||"";}
function bindHeroBioEditor(){
  var desc=document.getElementById("h-desc");if(!desc)return;
  desc.classList.toggle("dev-editable-text",!!isDevMode);
  desc.title=isDevMode?"Click to edit bio":"";
  desc.onclick=isDevMode?function(){openEdit("profile",0);}:null;
}
function renderCVLinks(){
  var cv=DB.cvFile;
  document.querySelectorAll(".cv-download-link").forEach(function(a){
    a.href=(cv&&cv.src)?cv.src:"cv.pdf";
    a.download=(cv&&cv.name)?cv.name:"cv.pdf";
    a.title=isDevMode?(cv?"Click to replace or delete uploaded CV":"Click to upload CV"):"Download CV";
  });
  document.querySelectorAll(".cv-link-text").forEach(function(el){
    if(el.classList.contains("c-val"))el.textContent=isDevMode?(cv?"Uploaded: "+(cv.name||"CV PDF"):"Upload CV for guest download"):"Download resume PDF for recruiters";
    else el.textContent=isDevMode?(cv?"Manage CV":"Download CV"):"Download CV";
  });
}
function renderContactLinks(){
  var wrap=document.getElementById("contact-links");if(!wrap)return;
  wrap.innerHTML="";
  (DB.contactLinks||[]).forEach(function(link){
    var isCv=link.type==="cv";
    var a=document.createElement("a");
    a.className="c-link"+(isCv?" cv-download-link":"");
    a.href=isCv?"cv.pdf":(link.href||"#");
    if(link.target)a.target="_blank";
    if(isCv){a.download="cv.pdf";a.onclick=function(e){handleCVClick(e);};}
    else if(isDevMode){a.onclick=function(e){e.preventDefault();openEditContactLink(link.id);};}
    a.innerHTML=(isDevMode?'<button class="contact-edit-btn" onclick="event.preventDefault();event.stopPropagation();openEditContactLink('+link.id+')" title="Edit contact">&#x270E;</button>':'')+
      '<div class="c-ico">'+safeText(link.icon||"")+'</div><div><span class="c-lbl">'+safeText(link.label||"")+'</span><span class="c-val'+(isCv?" cv-link-text":"")+'">'+safeText(link.value||"")+'</span></div>';
    wrap.appendChild(a);
  });
}
function renderContactAbout(){
  var el=document.getElementById("contact-about");if(!el)return;
  el.innerHTML=(DB.contactAbout||DEFAULT.contactAbout||"")+(isDevMode?'<button type="button" class="card-edit-btn contact-about-edit" onclick="openEditContactAbout()">&#x270E; Edit Text</button>':'');
}
function openEditContactAbout(){
  if(!isDevMode)return;
  modalType="contactAbout";
  editingId=null;
  buildForm("contactAbout",{content:DB.contactAbout||DEFAULT.contactAbout||""});
  document.getElementById("modal-wrap").classList.add("open");
}
function openEditContactLink(id){
  if(!isDevMode)return;
  var item=(DB.contactLinks||[]).find(function(x){return x.id===id;});
  if(!item)return;
  modalType="contact";
  editingId=id;
  buildForm("contact",item);
  document.getElementById("modal-wrap").classList.add("open");
}
function renderStats(){
  countUp("c-proj",DB.projects.length,0,"+");countUp("c-aw",DB.awards.length,0,"+");
  countUp("c-intl",3,0,"+");countUp("c-gpa2",parseFloat(DB.profile.gpa||3.53),2);
}
function countUp(id,target,dec,sfx){
  sfx=sfx||"";var el=document.getElementById(id);if(!el)return;
  var n=0,step=target/60;
  var iv=setInterval(function(){n=Math.min(n+step,target);el.textContent=dec>0?n.toFixed(dec):Math.round(n)+sfx;if(n>=target)clearInterval(iv);},25);
}

function renderAwards(){
  var g=document.getElementById("awards-grid");g.innerHTML="";
  DB.awards.forEach(function(a,i){
    var d=document.createElement("div");d.className="aw-card reveal";d.style.transitionDelay=(i*40)+"ms";
    d.innerHTML=(isDevMode?'<button class="card-del" onclick="delItem(\'awards\','+a.id+')">&#x2715;</button>':'')+
      '<div class="aw-year">'+a.year+'</div>'+
      '<div class="aw-name">'+a.name+'</div>'+
      '<div class="aw-sub">'+a.sub+'</div>'+
      '<span class="aw-tag '+(a.type==="intl"?"t-intl":"t-natl")+'"><i></i>'+(a.type==="intl"?"International":"National")+'</span>'+
      (isDevMode?'<button class="card-edit-btn" onclick="openEdit(\'award\','+a.id+')">&#x270E; Edit</button>':'');
    g.appendChild(d);
  });
}
function renderSkills(){
  var sb=document.getElementById("skill-bars");sb.innerHTML="";
  getPrimaryToolLogos().forEach(function(t){sb.appendChild(createToolLogo(t,true,"software"));});
  var tc=document.getElementById("tools-cloud");tc.innerHTML="";
  getSecondaryTools().forEach(function(t){tc.appendChild(createToolLogo(t,false,"hardware"));});
}
function toolMeta(name){
  var key=String(name||"").toLowerCase();
  var custom=DB.toolIcons&&DB.toolIcons[name];
  var map={
    "solidworks":{img:"https://cdn.simpleicons.org/dassaultsystemes/ff2d2d",mono:"SW",label:"SolidWorks",bg:"#d8272f",fg:"#fff"},
    "inventor":{img:"https://cdn.simpleicons.org/autodesk/ff8a00",mono:"IV",label:"Inventor",bg:"#ff8a00",fg:"#101010"},
    "ansys":{img:"https://cdn.simpleicons.org/ansys/ffcd00",mono:"An",label:"Ansys",bg:"#ffcd00",fg:"#111"},
    "openfoam":{svg:"foam",mono:"OF",label:"OpenFOAM",bg:"#1f9fd1",fg:"#fff"},
    "kicad":{img:"https://cdn.simpleicons.org/kicad/314cb0",mono:"Ki",label:"KiCad",bg:"#314cb0",fg:"#fff"},
    "python":{img:"https://cdn.simpleicons.org/python/3776ab",mono:"Py",label:"Python",bg:"#3776ab",fg:"#ffd43b"},
    "c++":{img:"https://cdn.simpleicons.org/cplusplus/00599c",mono:"C++",label:"C++",bg:"#00599c",fg:"#fff"},
    "html/css/js":{icons:["https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg","https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg","https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"],mono:"WEB",label:"HTML/CSS/JS",bg:"#f7df1e",fg:"#111"},
    "android studio":{img:"https://cdn.simpleicons.org/androidstudio/3ddc84",mono:"AS",label:"Android Studio",bg:"#3ddc84",fg:"#0b2b1a"},
    "firebase":{img:"https://cdn.simpleicons.org/firebase/ffca28",mono:"Fb",label:"Firebase",bg:"#ffca28",fg:"#3b2500"},
    "linux":{img:"https://cdn.simpleicons.org/linux/f5c400",mono:"Lx",label:"Linux",bg:"#111",fg:"#f5c400"},
    "tensorflow":{img:"https://cdn.simpleicons.org/tensorflow/ff6f00",mono:"TF",label:"TensorFlow",bg:"#ff6f00",fg:"#fff"},
    "keras":{img:"https://cdn.simpleicons.org/keras/d00000",mono:"Kr",label:"Keras",bg:"#d00000",fg:"#fff"},
    "ros":{img:"https://cdn.simpleicons.org/ros/22314e",mono:"ROS",label:"ROS",bg:"#22314e",fg:"#fff"},
    "ros 2":{img:"https://cdn.simpleicons.org/ros/22314e",mono:"R2",label:"ROS 2",bg:"#22314e",fg:"#fff"},
    "raspberry pi":{img:"https://cdn.simpleicons.org/raspberrypi/c51a4a",mono:"RPi",label:"Raspberry Pi",bg:"#c51a4a",fg:"#fff"},
    "arduino":{img:"https://cdn.simpleicons.org/arduino/00979d",mono:"Ar",label:"Arduino",bg:"#00979d",fg:"#fff"},
    "matlab":{img:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",mono:"ML",label:"MATLAB",bg:"#e16737",fg:"#fff"},
    "stm32":{img:"https://cdn.simpleicons.org/stmicroelectronics/03234b",mono:"ST",label:"STM32",bg:"#03234b",fg:"#fff"},
    "esp32":{img:"https://cdn.simpleicons.org/espressif/202020",mono:"ESP",label:"ESP32",bg:"#202020",fg:"#fff"},
    "blynk":{svg:"blynk",mono:"By",label:"Blynk",bg:"#23c48e",fg:"#061c14"},
    "rplidar":{mono:"Li",label:"RPLidar",bg:"#0a84ff",fg:"#fff"},
    "pid control":{mono:"PID",label:"PID Control",bg:"#6e56cf",fg:"#fff"}
  };
  var fallback={label:name,mono:String(name||"?").split(/\s+/).map(function(w){return w[0];}).join("").slice(0,3).toUpperCase(),bg:"#0a84ff",fg:"#fff"};
  var meta=Object.assign({},map[key]||fallback,custom||{});
  meta.key=key;
  return meta;
}
function createToolLogo(name,primary,section){
  var meta=toolMeta(name),el=document.createElement("div");
  el.className=(primary?"tool-logo":"tool-mini-logo")+" reveal";
  el.title=meta.label||name;
  if(isDevMode){
    el.style.cursor="pointer";
    el.onclick=function(){openEditSkillIcon(section,name);};
  }
  el.style.setProperty("--brand-bg",meta.bg||"#0a84ff");
  el.style.setProperty("--brand-fg",meta.fg||"#fff");
  var customSvg=meta.svg?buildToolSvg(meta.svg):"";
  var hasVisual=meta.img||customSvg||meta.icons;
  var encoded=encodeURIComponent(name).replace(/'/g,"%27");
  var icon=(meta.icons?'<div class="tool-logo-stack">'+meta.icons.map(function(src){return '<img src="'+src+'" alt="'+safeText(meta.label||name)+' logo" loading="lazy">';}).join("")+'</div>':"")+
    (customSvg?customSvg:"")+
    (meta.img?'<img src="'+meta.img+'" alt="'+safeText(meta.label||name)+' logo" loading="lazy" onerror="this.remove();this.nextElementSibling.style.display=\'flex\'">':'')+
    '<span'+(hasVisual?' style="display:none"':'')+'>'+safeText(meta.mono||"?")+'</span>';
  el.innerHTML=(isDevMode?'<button class="tool-logo-del" onclick="event.stopPropagation();deleteSkillIcon(\''+section+'\',\''+encoded+'\')" title="Delete icon">&#x2715;</button>':'')+
    '<div class="tool-logo-icon">'+icon+'</div><div class="tool-logo-name">'+safeText(meta.label||name)+'</div>';
  return el;
}
function buildToolSvg(type){
  if(type==="foam")return '<svg class="tool-custom-svg" viewBox="0 0 64 64" aria-hidden="true"><circle cx="23" cy="23" r="13" fill="#27b7df"/><circle cx="41" cy="22" r="8" fill="#9be7ff"/><circle cx="40" cy="41" r="14" fill="#176bff"/><circle cx="22" cy="43" r="7" fill="#67d5ff"/><path d="M20 35c10-11 20-11 30-1" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>';
  if(type==="blynk")return '<svg class="tool-custom-svg" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="10" width="44" height="44" rx="14" fill="#23c48e"/><path d="M22 34c0-8 6-14 14-14h8v8h-8c-4 0-6 2-6 6s2 6 6 6h8v8h-8c-8 0-14-6-14-14z" fill="#061c14"/><circle cx="21" cy="22" r="4" fill="#061c14"/></svg>';
  return "";
}
function getPrimaryToolLogos(){
  return DB.softwareTools||["SolidWorks","Inventor","Ansys","OpenFOAM","ROS","Python","C++","TensorFlow","MATLAB","Android Studio","Firebase","KiCad"];
}
function getSecondaryTools(){
  return DB.hardwareTools||["Raspberry Pi","STM32","ROS 2","Keras","Arduino","ESP32","HTML/CSS/JS","Blynk","Linux","RPLidar","PID Control"];
}
function deleteSkillIcon(section,encodedName){
  if(!isDevMode)return;
  var name=decodeURIComponent(encodedName||"");
  var key=section==="software"?"softwareTools":"hardwareTools";
  if(!confirm("Delete icon "+name+"?"))return;
  DB[key]=(DB[key]||[]).filter(function(t){return t!==name;});
  if(DB.toolIcons&&!(DB.softwareTools||[]).includes(name)&&!(DB.hardwareTools||[]).includes(name))delete DB.toolIcons[name];
  saveDB();
  renderSkills();
  toast("Icon deleted");
}
function openEditSkillIcon(section,name){
  if(!isDevMode)return;
  modalType="skill";
  editingId=null;
  editingToolIcon={section:section,name:name};
  var meta=(DB.toolIcons&&DB.toolIcons[name])||{};
  buildForm("skill",{section:section,name:name,label:meta.label||name,mono:meta.mono||"",img:meta.img||""});
  document.getElementById("modal-wrap").classList.add("open");
}

function renderProjects(activeFilter){
  var g=document.getElementById("proj-grid");g.innerHTML="";
  DB.projects.forEach(function(p,i){
    var cats=Array.isArray(p.cats)?p.cats:(p.cats||"").split(" ").filter(Boolean);
    var show=activeFilter==="all"||cats.includes(activeFilter);
    var imgs=p.images||[];
    var thumbSrc=imgs.length>0?imgs[0]:null;
    var card=document.createElement("div");
    card.className="pc reveal"+(show?"":" hidden");
    card.dataset.cats=cats.join(" ");
    card.dataset.id=p.id;
    card.style.transitionDelay=(i%3*60)+"ms";
    var pid=p.id;
    card.onclick=function(e){
      if(e.target.classList.contains("card-del")||e.target.classList.contains("card-edit-btn"))return;
      openDetail(pid);
    };
    card.innerHTML=
      (isDevMode?'<button class="card-del" onclick="event.stopPropagation();delItem(\'projects\','+p.id+')">&#x2715;</button>':'')+
      '<div class="pc-thumb">'+
        (thumbSrc?'<img src="'+thumbSrc+'" alt="'+p.title+'" loading="lazy">':'<div class="pc-thumb-fallback"><div class="pc-icon">'+(p.icon||"\uD83D\uDCC1")+'</div></div>')+
        '<div class="pc-badge '+(p.status==="done"?"b-done":"b-wip")+'"><span class="b-dot"></span>'+(p.status==="done"?"Completed":"In Progress")+'</div>'+
        '<div class="pc-date">'+(p.date||"")+'</div>'+
        '<div class="pc-view-hint">VIEW PROJECT &#x2192;</div>'+
      '</div>'+
      '<div class="pc-body">'+
        '<div class="pc-title">'+p.title+'</div>'+
        '<div class="pc-desc">'+p.desc+'</div>'+
        '<div class="pc-tags">'+(p.tags||[]).map(function(t){return '<span class="pc-tag">'+t+'</span>';}).join("")+'</div>'+
        '<div class="pc-foot"><div class="pc-cat">CAT: <b>'+cats[0].toUpperCase()+'</b></div><div class="pc-open-btn">View detail &#x2192;</div></div>'+
      '</div>'+
      (isDevMode?'<button class="card-edit-btn" onclick="event.stopPropagation();openEdit(\'project\','+p.id+')">&#x270E; Edit</button>':'');
    g.appendChild(card);
  });
  observe();
}
function filterProj(cat,btn){
  document.querySelectorAll(".f-pill").forEach(function(p){p.classList.remove("active");});btn.classList.add("active");
  document.querySelectorAll(".pc").forEach(function(c){var cats=c.dataset.cats.split(" ");c.classList.toggle("hidden",cat!=="all"&&!cats.includes(cat));});
}

function safeText(value){
  return String(value||"").replace(/[&<>"']/g,function(ch){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
  });
}
function getTimelineYear(value){
  var match=String(value||"").match(/20\d{2}/);
  return match?match[0]:"2024";
}
function renderTimeline(){
  var el=document.getElementById("timeline-list");
  if(!el)return;
  var years=["2026","2025","2024","2023"];
  var items=[];
  (DB.awards||[]).forEach(function(a){
    items.push({year:getTimelineYear(a.year||a.sub),type:"Award",title:a.name,desc:a.sub,meta:a.type==="intl"?"International":"National"});
  });
  (DB.experience||[]).forEach(function(e){
    items.push({year:getTimelineYear(e.period),type:"Experience",title:e.role,desc:e.org,meta:e.period});
  });
  (DB.projects||[]).forEach(function(p){
    var cats=Array.isArray(p.cats)?p.cats:[p.cats||"Project"];
    items.push({year:getTimelineYear(p.date),type:"Project",title:p.title,desc:p.desc,meta:cats[0]||"Project"});
  });
  items=items.filter(function(item){return years.includes(item.year);});
  items.sort(function(a,b){
    return Number(b.year)-Number(a.year)||a.type.localeCompare(b.type)||a.title.localeCompare(b.title);
  });
  if(!items.length){
    el.innerHTML='<div class="timeline-empty reveal">Timeline data will appear here after projects, awards, or experience are added.</div>';
    return;
  }
  var byYear={};
  items.forEach(function(item){
    if(!byYear[item.year])byYear[item.year]=[];
    byYear[item.year].push(item);
  });
  el.innerHTML=years.map(function(year){
    var rows=byYear[year]||[];
    if(!rows.length)return "";
    return '<div class="timeline-year-block reveal">'+
      '<div class="timeline-year">'+year+'</div>'+
      '<div class="timeline-items">'+rows.map(function(item){
        return '<article class="timeline-card">'+
          '<div class="timeline-type">'+safeText(item.type)+'</div>'+
          '<h3>'+safeText(item.title)+'</h3>'+
          '<p>'+safeText(item.desc)+'</p>'+
          '<span>'+safeText(item.meta)+'</span>'+
        '</article>';
      }).join("")+'</div>'+
    '</div>';
  }).join("");
}
