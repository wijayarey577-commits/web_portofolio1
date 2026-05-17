var CREDS={user:"christofer",pass:"crw2024"};
var SK="crw_pf_v7";
var THEME_KEY="crw_theme";
var isDevMode=false,DB={},modalType=null,editingId=null,currentDetailId=null,cropState=null,modelState=null;
var MODEL_MAX_TRIANGLES=6500;
var MODEL_MAX_FILE_BYTES=2500000;

var DEFAULT={
  profile:{fname:"CHRISTOFER",lname:"REY WIJAYA",role:"Robotics & Automotive Engineer",school:"Binus University \u00B7 Class of 2027",desc:"I design and build embedded systems, robotics, and automotive solutions with a passion for innovation and performance. Experienced in turning ideas into real-world prototypes and competing at the highest level.",gpa:"3.53"},
  awards:[
    {id:1,year:"2026",name:"Top 6 \u2014 Shell Eco Marathon Qatar",sub:"Electric Battery Category \u00B7 490 km/kWh",type:"intl"},
    {id:2,year:"2025",name:"Top 4 Finalist KMHE",sub:"Kontes Mobil Hemat Energi \u00B7 Jember \u00B7 Electric Battery Prototype",type:"natl"},
    {id:3,year:"2025",name:"Top 6 Finalist KRTI",sub:"Kontes Robot Terbang Indonesia \u00B7 Padang \u00B7 VTOL Division",type:"natl"},
    {id:4,year:"2025",name:"Top 4 \u2014 Shell Eco Marathon Qatar",sub:"Electric Battery Prototype Category \u00B7 Doha",type:"intl"},
    {id:5,year:"2024",name:"Top Finalist KRTI",sub:"Yogyakarta \u00B7 Vertical Take Off and Landing Division",type:"natl"},
    {id:6,year:"2024",name:"Best Spirit Award",sub:"Shell Eco Marathon \u00B7 Mandalika",type:"intl"},
    {id:7,year:"2024",name:"Top 7 \u2014 Prototype Battery Electric",sub:"National Competition",type:"natl"},
    {id:8,year:"2024",name:"Top 10 \u2014 3kg Sumo Robot",sub:"National Level Robotics Competition",type:"natl"}
  ],
  skills:[
    {id:1,name:"Embedded Systems (RPi, STM32, MCU)",pct:90},{id:2,name:"C++ / Python / ROS Programming",pct:88},
    {id:3,name:"CFD Simulation (OpenFOAM)",pct:85},{id:4,name:"CAD Design (SolidWorks, Inventor)",pct:88},
    {id:5,name:"AI / ML (TensorFlow / Keras)",pct:82},{id:6,name:"FEA Analysis (Ansys)",pct:80},
    {id:7,name:"IoT Development (Blynk, Firebase)",pct:83},{id:8,name:"Mobile App (Android Studio)",pct:75}
  ],
  tools:["Raspberry Pi","STM32","ROS","ROS 2","TensorFlow","Keras","OpenFOAM","SolidWorks","Inventor","Ansys","KiCad","MATLAB","Arduino","ESP32","Python","C++","HTML/CSS/JS","Android Studio","Blynk","Firebase","Linux","RPLidar","PID Control"],
  projects:[
    {id:1,cats:["competition","ev"],status:"done",date:"JAN 2026",icon:"\uD83C\uDFCE\uFE0F",title:"Shell Eco Marathon 2026",desc:"6th place internationally \u2014 490 km/kWh efficiency. Designed energy-efficient EV optimizing aerodynamics, electrical systems and energy management in Doha, Qatar. D'BASE Team Proto achieved highest efficiency in team history.",tags:["Aerodynamics","EV Design","Energy Management","Electrical Systems","Lightweight Chassis"],images:[]},
    {id:2,cats:["robotics"],status:"done",date:"JAN 2026",icon:"\uD83E\uDD16",title:"AGV Agricultural Pick & Place",desc:"Autonomous agricultural AGV with robotic arm, ROS 2, RPLidar navigation and inverse kinematics for pick-and-place tasks. Best Semester 5 Final Project at Binus University.",tags:["ROS 2","RPLidar","Inverse Kinematics","Autonomous Nav","Python"],images:[]},
    {id:3,cats:["robotics"],status:"done",date:"MAY 2025",icon:"\uD83E\uDDBE",title:"Robot Dog \u2014 Quadruped Bot",desc:"Quadruped robot for monitoring & security using forward and inverse kinematics for stable locomotion. Integrated mechanical design, actuator control, and embedded systems. Recognized as Best Final Project at Binus University.",tags:["Kinematics","Embedded Systems","Actuator Control","Mechanical Design"],images:[]},
    {id:4,cats:["cfd"],status:"wip",date:"NOV 2025",icon:"\uD83C\uDF0A",title:"CAE Internship \u2014 PT. Kalbe Morinaga",desc:"Industrial spray dryer CFD simulation using OpenFOAM. Analyzed airflow distribution, particle drying efficiency and structural design for thermal performance optimization.",tags:["OpenFOAM","CFD","FEA","SolidWorks","Ansys","Linux"],images:[]},
    {id:5,cats:["drone","competition"],status:"done",date:"OCT 2025",icon:"\uD83D\uDE81",title:"KRTI VTOL Drone 2025",desc:"Autonomous hexacopter with ROS, PID control, GPS, and RTK for precise navigation. Object lifting/dropping and autonomous gate navigation. 6th place nationally at KRTI 2025 in Padang.",tags:["ROS","PID Control","GPS","RTK","Hexacopter"],images:[]},
    {id:6,cats:["cfd"],status:"done",date:"JUN 2025",icon:"\uD83D\uDCA8",title:"Vehicle & UAV CFD Simulation",desc:"CFD simulations for vehicle and UAV models analyzing drag (Cd) and lift (Cl) coefficients. Modeling, meshing, and simulating airflow to evaluate performance under different conditions.",tags:["OpenFOAM","Aerodynamics","Meshing","Cd/Cl Analysis"],images:[]},
    {id:7,cats:["robotics"],status:"done",date:"APR 2025",icon:"\uD83E\uDDBF",title:"SCARA Robotic Arm 4-DOF",desc:"4-DOF SCARA arm for CNC laser applications \u2014 inverse kinematics, G-code generation, CNC integration for precise drawing and laser cutting automation.",tags:["Inverse Kinematics","G-code","CNC","Motor Control"],images:[]},
    {id:8,cats:["competition","ev"],status:"done",date:"OCT 2025",icon:"\u26A1",title:"KMHE 2025 \u2014 Electric Prototype",desc:"4th place nationally at KMHE 2025 in Jember. Designed electric battery prototype focused on energy efficiency and performance optimization in first participation.",tags:["EV Design","Energy Efficiency","Chassis Design","Electrical"],images:[]},
    {id:9,cats:["competition","ev"],status:"done",date:"FEB 2025",icon:"\uD83C\uDFC1",title:"Shell Eco Marathon 2025",desc:"4th place in Doha \u2014 lightweight electric prototype with chassis optimization and electrical system redesign. Improved overall energy performance through iterative engineering.",tags:["Lightweight Chassis","Electrical System","Automotive Eng"],images:[]},
    {id:10,cats:["cfd","ev"],status:"done",date:"MAR 2026",icon:"\uD83C\uDFD7\uFE0F",title:"RnD Chassis & Body Design",desc:"New chassis and body prototype \u2014 aerodynamic drag reduction (Cd), FEA stress analysis, safety factor evaluation. Target weight under 20 kg.",tags:["FEA","Aerodynamics","SolidWorks","Drag Reduction"],images:[]},
    {id:11,cats:["drone","competition"],status:"done",date:"OCT 2024",icon:"\uD83D\uDE80",title:"Drone Quadcopter \u2014 KRTI 2024",desc:"Quadcopter for KRTI reaching the finals in Yogyakarta. Control systems, propulsion, ROS integration, GPS navigation and data communication optimization.",tags:["ROS","GPS","Flight Control","Propulsion"],images:[]},
    {id:12,cats:["robotics"],status:"done",date:"MAY 2024",icon:"\u2699\uFE0F",title:"Analog Robotic Arm (IC555)",desc:"4-DOF analog robotic arm without microcontroller using IC555 timers. Custom PCB designed and fabricated with handheld control panel.",tags:["IC555","PCB Design","KiCad","Analog Electronics"],images:[]},
    {id:13,cats:["robotics","competition"],status:"done",date:"MAY 2024",icon:"\uD83E\uDD4A",title:"Sumo Robot \u2014 National Level",desc:"3kg sumo robot achieving Top 10 nationally. Optimized chassis design, torque management, and strategic programming for competition.",tags:["ESP32","Circuit Design","IoT","Motor Control"],images:[]},
    {id:14,cats:["ev","cfd"],status:"done",date:"DEC 2025",icon:"\uD83D\uDEF5",title:"Scooter CAD Prototype",desc:"Scooter prototype in SolidWorks for R&D \u2014 structural design, ergonomics, 1:5 scale fabrication using 3D printing.",tags:["SolidWorks","3D Printing","Product Design","CAD"],images:[]},
    {id:15,cats:["robotics"],status:"done",date:"DEC 2023",icon:"\uD83D\uDCE1",title:"IoT Transporter Robot",desc:"Semi-autonomous transporter based on ESP32 with Wi-Fi smartphone control and record & playback function.",tags:["ESP32","Wi-Fi","IoT","Motor Control"],images:[]},
    {id:16,cats:["robotics"],status:"wip",date:"OCT 2025",icon:"\uD83E\uDDBE",title:"Prosthetic Arm Project",desc:"Functional prosthetic arm with EMG myoelectric sensors for intuitive movement control and ergonomic design.",tags:["EMG Sensors","Embedded Systems","Mechanical Design"],images:[]}
  ],
  experience:[
    {id:1,period:"Nov 2025 \u2013 Present",org:"PT. Kalbe Morinaga Indonesia \u00B7 Cikampek",role:"CAE Engineer Intern",bullets:["Structural and Strength Analysis (FEA)","Fluid Flow and Thermal Analysis (CFD - OpenFOAM)","Design Optimization and Weight Reduction","Model Validation and Virtual Testing"]},
    {id:2,period:"May 2025 \u2013 Present",org:"Binus University \u00B7 D'BASE TEAM",role:"Head of Technical",bullets:["Directed aerodynamic design and lightweight composite materials","Designed rigid tubular chassis with optimal wheel geometry","Implemented precision energy management with real-time telemetry"]},
    {id:3,period:"May 2024 \u2013 Present",org:"Binus University \u00B7 AERO BASE",role:"Head of Technical & Founder",bullets:["Oversaw chassis and body design with center of gravity analysis","Directed PID control algorithm optimization in flight controller firmware","Selected and managed propulsion systems (motors, ESCs, propellers, batteries)"]},
    {id:4,period:"Jun 2024 \u2013 Present",org:"Independent \u00B7 Tangerang",role:"3D Fabrication Unit",bullets:["FEA stress analysis using SolidWorks, Inventor, Ansys","Hands-on 3D printer operation and material selection","Proficiency in 3D CAD software and engineering materials"]},
    {id:5,period:"Jun \u2013 Nov 2024",org:"Binus Aso School of Engineering",role:"Research Assistant \u2014 PCB & Schematics",bullets:["Schematic Design & Component Selection using KiCad","Strategic PCB Layout & Power Management","DFM, Prototyping, Hardware-Software Integration"]},
    {id:6,period:"Jan \u2013 May 2024",org:"Binus Aso School of Engineering",role:"Research Assistant \u2014 3D Design UAV & Automotive",bullets:["Advanced Geometric Modeling for UAV & Robotic Systems","Engineering Simulation (CAE) and DFM","Technical Assembly and Documentation"]},
    {id:7,period:"Oct 2023 \u2013 Oct 2024",org:"BASE CORE \u00B7 Binus University",role:"Robotics Research & AI Division",bullets:["Built 3kg sumo robot for national competition","Implemented autonomous line-following vehicle with PID control","Applied AI/ML and Computer Vision for object recognition"]}
  ],
  certs:["Electric Prototype SEM APME 2026","Certified Python Programmer (Kaggle)","Project Management Foundations (LinkedIn)","Turnamen Robotika Indonesia","VTOL KRTI 2024 (BPTI)","Electric Prototype SEM APME 2024","Electric Motor Prototype KMHE 2025 (BPTI)","VTOL KRTI 2025 (BPTI)","Electric Prototype SEM APME 2025"]
};

function freshDefault(){return JSON.parse(JSON.stringify(DEFAULT));}
function loadDB(){
  var base=freshDefault();
  var saved=null;
  try{saved=JSON.parse(localStorage.getItem(SK)||"null");}catch(e){saved=null;}
  if(saved&&typeof saved==="object"){
    DB=Object.assign(base,saved);
    DB.profile=Object.assign(base.profile,saved.profile||{});
    ["awards","skills","tools","projects","experience","certs"].forEach(function(key){
      if(!Array.isArray(DB[key]))DB[key]=base[key];
    });
  }else{
    DB=base;
  }
}
function saveDB(){localStorage.setItem(SK,JSON.stringify(DB));}
function nextId(arr){return arr.length?Math.max.apply(null,arr.map(function(x){return x.id;}))+1:1;}

loadDB();
initTheme();
renderAll();
initMisc();

function initTheme(){
  var saved=localStorage.getItem(THEME_KEY);
  if(saved!=="light"&&saved!=="dark")saved="dark";
  applyTheme(saved);
}
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme",theme);
  var icon=document.getElementById("theme-icon");
  if(icon)icon.textContent=theme==="light"?"☀":"☾";
}
function toggleTheme(){
  var current=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";
  var next=current==="light"?"dark":"light";
  localStorage.setItem(THEME_KEY,next);
  applyTheme(next);
}

function initMisc(){
  if(!("ontouchstart" in window)){
    var c=document.getElementById("cur"),r=document.getElementById("cur-ring");
    if(c&&r){
      document.addEventListener("mousemove",function(e){c.style.left=e.clientX+"px";c.style.top=e.clientY+"px";setTimeout(function(){r.style.left=e.clientX+"px";r.style.top=e.clientY+"px";},80);});
    }
    document.querySelectorAll("a,button,input,select,textarea").forEach(function(el){
      el.addEventListener("mouseenter",function(){if(r&&c){r.style.transform="translate(-50%,-50%) scale(1.8)";c.style.opacity="0";}});
      el.addEventListener("mouseleave",function(){if(r&&c){r.style.transform="translate(-50%,-50%) scale(1)";c.style.opacity="1";}});
    });
  }else{["cur","cur-ring"].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display="none";});}
  window.addEventListener("scroll",function(){var bar=document.getElementById("prog");if(bar){var p=(scrollY/(document.body.scrollHeight-innerHeight))*100;bar.style.width=p+"%";}});
  var s=0;setInterval(function(){var tick=document.getElementById("ticker");if(!tick)return;s++;var h=String(Math.floor(s/3600)).padStart(2,"0"),m=String(Math.floor((s%3600)/60)).padStart(2,"0"),sec=String(s%60).padStart(2,"0");tick.textContent=h+":"+m+":"+sec;},1000);
  document.addEventListener("click",function(e){
    var btn=document.getElementById("login-btn"),drop=document.getElementById("login-drop");
    if(btn&&drop&&!btn.contains(e.target)&&!drop.contains(e.target))drop.classList.remove("open");
    var hb=document.getElementById("hbg"),mn=document.getElementById("mob-nav");
    if(hb&&mn&&!hb.contains(e.target)&&!mn.contains(e.target)){hb.classList.remove("open");mn.classList.remove("open");}
  });
  setText("yr",new Date().getFullYear());
  ["inp-user","inp-pass"].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener("keydown",function(e){if(e.key==="Enter")doLogin();});});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeLightbox();if(currentDetailId)closeDetail();}});
}

function toggleDrop(){document.getElementById("login-drop").classList.toggle("open");}
function closeDrop(){document.getElementById("login-drop").classList.remove("open");}
function toggleNav(){document.getElementById("hbg").classList.toggle("open");document.getElementById("mob-nav").classList.toggle("open");}
function closeNav(){document.getElementById("hbg").classList.remove("open");document.getElementById("mob-nav").classList.remove("open");}

function doLogin(){
  var u=document.getElementById("inp-user").value.trim(),p=document.getElementById("inp-pass").value;
  var err=document.getElementById("ld-err");
  if(u===CREDS.user&&p===CREDS.pass){err.classList.remove("show");activateDevMode();closeDrop();document.getElementById("inp-pass").value="";toast("Developer mode aktif \u2713");}
  else{err.classList.add("show");document.getElementById("inp-pass").value="";}
}
function activateDevMode(){
  isDevMode=true;document.body.classList.add("dev-mode");
  document.getElementById("dev-bar").classList.add("show");
  document.getElementById("login-btn").classList.add("is-dev");
  document.getElementById("login-btn").innerHTML='<span class="dev-dot-nav"></span> Dev Mode';
  document.getElementById("ld-guest-state").style.display="none";
  document.getElementById("ld-dev-state").classList.add("show");
  renderAll();
}
function doLogout(){
  isDevMode=false;document.body.classList.remove("dev-mode");
  document.getElementById("dev-bar").classList.remove("show");
  document.getElementById("login-btn").classList.remove("is-dev");
  document.getElementById("login-btn").innerHTML="\u2699 Dev Login";
  document.getElementById("ld-guest-state").style.display="block";
  document.getElementById("ld-dev-state").classList.remove("show");
  closeDrop();renderAll();toast("Logged out");
}

function renderAll(){
  renderProfile();renderStats();renderAwards();renderSkills();
  renderProjects("all");renderExp();renderCerts();
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
}
function setText(id,value){var el=document.getElementById(id);if(el)el.textContent=value||"";}
function setHtml(id,value){var el=document.getElementById(id);if(el)el.innerHTML=value||"";}
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
      '<span class="aw-tag '+(a.type==="intl"?"t-intl":"t-natl")+'">'+(a.type==="intl"?"\uD83C\uDF0D International":"\uD83C\uDDEE\uD83C\uDDE9 National")+'</span>'+
      (isDevMode?'<button class="card-edit-btn" onclick="openEdit(\'award\','+a.id+')">&#x270E; Edit</button>':'');
    g.appendChild(d);
  });
}
function renderSkills(){
  var sb=document.getElementById("skill-bars");sb.innerHTML="";
  DB.skills.forEach(function(s){
    var d=document.createElement("div");d.className="sk-item reveal";
    d.innerHTML=(isDevMode?'<button class="card-del" onclick="delItem(\'skills\','+s.id+')" style="top:0;right:0">&#x2715;</button>':'')+
      '<div class="sk-top"><span class="sk-name">'+s.name+'</span><span class="sk-pct">'+s.pct+'%</span></div>'+
      '<div class="sk-track"><div class="sk-fill" data-pct="'+(s.pct/100)+'"></div></div>';
    sb.appendChild(d);
  });
  var tc=document.getElementById("tools-cloud");tc.innerHTML="";
  DB.tools.forEach(function(t){var sp=document.createElement("span");sp.className="tool-chip reveal";sp.textContent=t;tc.appendChild(sp);});
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
  if(!list)return;
  stopModelViewer();
  list.innerHTML="";
  var models=project.models||[];
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

function renderExp(){
  var el=document.getElementById("exp-list");el.innerHTML="";
  DB.experience.forEach(function(e,i){
    var d=document.createElement("div");d.className="exp-item reveal";d.style.transitionDelay=(i*50)+"ms";
    d.innerHTML=
      (isDevMode?'<button class="card-del" onclick="delItem(\'experience\','+e.id+')" style="top:12px;right:12px">&#x2715;</button>':'')+
      '<div class="exp-left"><div class="exp-per">'+e.period+'</div><div class="exp-org">'+e.org+'</div></div>'+
      '<div class="exp-right"><div class="exp-role">'+e.role+'</div>'+
      '<ul class="exp-bul">'+(e.bullets||[]).map(function(b){return '<li>'+b+'</li>';}).join("")+'</ul>'+
      (isDevMode?'<button class="card-edit-btn" style="position:relative;margin-top:8px" onclick="openEdit(\'exp\','+e.id+')">&#x270E; Edit</button>':'')+
      '</div>';
    el.appendChild(d);
  });
}
function renderCerts(){
  var cg=document.getElementById("cert-grid");cg.innerHTML="";
  DB.certs.forEach(function(c,i){
    var sp=document.createElement("span");sp.className="cert-chip reveal";sp.textContent=c;
    if(isDevMode){sp.style.cursor="pointer";sp.title="Click to delete";sp.onclick=function(){if(confirm('Delete "'+c+'"?')){DB.certs.splice(i,1);saveDB();renderCerts();toast("Deleted");}};}
    cg.appendChild(sp);
  });
}

function delItem(col,id){
  if(!confirm("Delete this item?"))return;
  DB[col]=DB[col].filter(function(x){return x.id!==id;});saveDB();
  if(col==="awards")renderAwards();
  else if(col==="skills")renderSkills();
  else if(col==="projects")renderProjects("all");
  else if(col==="experience")renderExp();
  toast("Deleted");observe();
}

function openModal(type){if(!isDevMode){toast("Developer access only","err");return;}modalType=type;editingId=null;buildForm(type,null);document.getElementById("modal-wrap").classList.add("open");}
function openEdit(type,id){
  if(!isDevMode)return;modalType=type;editingId=id;var item=null;
  if(type==="award")item=DB.awards.find(function(x){return x.id===id;});
  else if(type==="skill")item=DB.skills.find(function(x){return x.id===id;});
  else if(type==="project")item=DB.projects.find(function(x){return x.id===id;});
  else if(type==="exp")item=DB.experience.find(function(x){return x.id===id;});
  else if(type==="profile")item=DB.profile;
  buildForm(type,item);document.getElementById("modal-wrap").classList.add("open");
}
function closeModal(){document.getElementById("modal-wrap").classList.remove("open");}
function closeModalOutside(e){if(e.target===document.getElementById("modal-wrap"))closeModal();}

function fi(id,lbl,ph,val,t){t=t||"text";return '<div class="mg"><label class="ml">'+lbl+'</label><input type="'+t+'" class="mi" id="mf-'+id+'" placeholder="'+ph+'" value="'+(val||"")+'"></div>';}
function fs(id,lbl,opts,val){return '<div class="mg"><label class="ml">'+lbl+'</label><select class="ms" id="mf-'+id+'">'+opts.map(function(o){return '<option value="'+o.v+'"'+(val===o.v?" selected":"")+'>'+o.l+'</option>';}).join("")+'</select></div>';}
function fa(id,lbl,ph,val){return '<div class="mg"><label class="ml">'+lbl+'</label><textarea class="mta" id="mf-'+id+'" placeholder="'+ph+'">'+(val||"")+'</textarea></div>';}

function buildForm(type,data){
  var titles={award:"Award",skill:"Skill",project:"Project",exp:"Experience",cert:"Certification",profile:"Edit Profile"};
  document.getElementById("modal-title").textContent=(data&&type!=="cert"?"Edit ":"Add ")+titles[type];
  var b=document.getElementById("modal-body");b.innerHTML="";var d=data||{};
  if(type==="award"){b.innerHTML=fi("year","Year","2024",d.year)+fi("name","Award Name","Top 4 Competition",d.name)+fi("sub","Subtitle","Category \u00B7 Location",d.sub)+fs("type","Type",[{v:"intl",l:"\uD83C\uDF0D International"},{v:"natl",l:"\uD83C\uDDEE\uD83C\uDDE9 National"}],d.type||"natl");}
  else if(type==="skill"){b.innerHTML=fi("name","Skill Name","Embedded Systems",d.name)+fi("pct","Proficiency %","85",d.pct,"number")+'<div class="mg"><label class="ml">OR \u2014 Add Tool Chip</label><input type="text" class="mi" id="mf-tool" placeholder="e.g. Kubernetes"></div>';}
  else if(type==="project"){
    b.innerHTML='<div class="mrow">'+fi("title","Project Title","Robot Dog",d.title)+fi("icon","Fallback Emoji (optional)","\uD83E\uDD16",d.icon)+'</div>';
    b.innerHTML+='<div class="mrow">'+fs("status","Status",[{v:"done",l:"\u2705 Completed"},{v:"wip",l:"\u23F3 In Progress"}],d.status)+fi("date","Date","JAN 2026",d.date)+'</div>';
    b.innerHTML+=fi("cats","Categories (comma separated)","robotics, competition",Array.isArray(d.cats)?d.cats.join(", "):(d.cats||""));
    b.innerHTML+=fa("desc","Description","Describe this project...",d.desc);
    b.innerHTML+=fi("tags","Tech Tags (comma separated)","ROS, Python, STM32",(d.tags||[]).join(", "));
    b.innerHTML+='<div class="mg"><label class="ml">Project Images / Thumbnail</label><input type="file" class="mi" id="mf-images" accept="image/*" multiple><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Setiap gambar akan masuk crop editor sebelum disimpan. Gambar pertama menjadi thumbnail card.</div></div>';
    if(d.images&&d.images.length){b.innerHTML+='<div class="mg"><label class="ml">Current Images</label><div class="modal-img-grid">'+d.images.map(function(src,i){return '<div class="modal-img-item"><img src="'+src+'"><button type="button" onclick="deleteModalProjectImage('+i+')">&#x2715;</button></div>';}).join("")+'</div><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6">Klik X untuk menghapus gambar lama.</div></div>';}
    b.innerHTML+='<div class="mg"><label class="ml">3D Models (STL)</label><input type="file" class="mi" id="mf-models" accept=".stl,model/stl" multiple><div style="font-family:var(--fm);font-size:9px;color:var(--muted);line-height:1.6;margin-top:4px">Upload file .stl ASCII/Binary untuk ditampilkan di viewer 3D project.</div></div>';
    if(d.models&&d.models.length){b.innerHTML+='<div class="mg"><label class="ml">Current 3D Models</label><div class="modal-model-list">'+d.models.map(function(m,i){return '<button type="button" onclick="deleteModalProjectModel('+i+')"><span>'+m.name+'</span><b>&#x2715;</b></button>';}).join("")+'</div></div>';}
  }else if(type==="exp"){
    b.innerHTML=fi("period","Period","Nov 2025 \u2013 Present",d.period)+fi("org","Organization","PT. Kalbe Morinaga",d.org)+fi("role","Role","CAE Engineer Intern",d.role);
    b.innerHTML+=fa("bullets","Bullet Points (one per line)","Structural Analysis (FEA)",(d.bullets||[]).join("\n"));
  }else if(type==="cert"){b.innerHTML=fi("name","Certificate Name","Electric Prototype SEM 2026","");}
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

async function saveModal(){
  if(modalType==="award"){
    var item={id:editingId||nextId(DB.awards),year:v("year"),name:v("name"),sub:v("sub"),type:v("type")};
    if(!item.name){toast("Name required","err");return;}
    if(editingId){var i=DB.awards.findIndex(function(x){return x.id===editingId;});DB.awards[i]=item;}else DB.awards.push(item);
    saveDB();renderAwards();
  }else if(modalType==="skill"){
    var tool=v("tool");
    if(tool){DB.tools.push(tool);saveDB();renderSkills();toast("Tool added!");closeModal();return;}
    var item={id:editingId||nextId(DB.skills),name:v("name"),pct:parseInt(v("pct"))||80};
    if(!item.name){toast("Name required","err");return;}
    if(editingId){var i=DB.skills.findIndex(function(x){return x.id===editingId;});DB.skills[i]=item;}else DB.skills.push(item);
    saveDB();renderSkills();
  }else if(modalType==="project"){
    var cats=v("cats").split(",").map(function(s){return s.trim();}).filter(Boolean);
    var tags=v("tags").split(",").map(function(s){return s.trim();}).filter(Boolean);
    var existing=editingId?DB.projects.find(function(x){return x.id===editingId;}):null;
    var item={id:editingId||nextId(DB.projects),title:v("title"),icon:v("icon")||"\uD83D\uDCC1",status:v("status"),date:v("date"),cats:cats,desc:v("desc"),tags:tags,images:existing?existing.images||[]:[],models:existing?existing.models||[]:[]};
    if(!item.title){toast("Title required","err");return;}
    var imgInput=document.getElementById("mf-images");
    var files=imgInput?Array.from(imgInput.files):[];
    var modelInput=document.getElementById("mf-models");
    var modelFiles=modelInput?Array.from(modelInput.files).filter(function(file){return /\.stl$/i.test(file.name);}):[];
    function finishProjectSave(){
      if(editingId){var i=DB.projects.findIndex(function(x){return x.id===editingId;});DB.projects[i]=item;}else DB.projects.push(item);
      saveDB();renderProjects("all");toast("Project saved!");closeModal();
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
    var item={id:editingId||nextId(DB.experience),period:v("period"),org:v("org"),role:v("role"),bullets:bullets};
    if(!item.role){toast("Role required","err");return;}
    if(editingId){var i=DB.experience.findIndex(function(x){return x.id===editingId;});DB.experience[i]=item;}else DB.experience.push(item);
    saveDB();renderExp();
  }else if(modalType==="cert"){
    var n=v("name");if(!n){toast("Name required","err");return;}
    DB.certs.push(n);saveDB();renderCerts();
  }else if(modalType==="profile"){
    DB.profile={fname:v("fname"),lname:v("lname"),role:v("role"),school:v("school"),gpa:v("gpa"),desc:v("desc")};
    saveDB();renderProfile();renderStats();
  }
  toast(editingId?"Updated!":"Added!");closeModal();setTimeout(observe,150);
}
function resetAll(){if(!confirm("Reset semua data ke default?"))return;localStorage.removeItem(SK);loadDB();renderAll();toast("Data reset");}

function exportDatabase(){
  var payload={
    app:"crw-portfolio",
    version:8,
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
  ["awards","skills","tools","projects","experience","certs"].forEach(function(key){
    if(!Array.isArray(merged[key]))merged[key]=base[key];
  });
  merged.projects=merged.projects.map(function(p){
    if(!Array.isArray(p.images))p.images=[];
    if(!Array.isArray(p.models))p.models=[];
    return p;
  });
  return merged;
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
function cropFiles(files){
  return files.reduce(function(chain,file){
    return chain.then(function(list){
      return cropFile(file).then(function(src){list.push(src);return list;});
    });
  },Promise.resolve([]));
}
function cropFile(file){
  return new Promise(function(resolve,reject){
    readFileAsDataURL(file).then(function(src){
      var img=new Image();
      img.onload=function(){
        cropState={
          img:img,src:src,resolve:resolve,reject:reject,
          zoom:1,offsetX:0,offsetY:0,drag:false,lastX:0,lastY:0
        };
        var wrap=document.getElementById("crop-wrap"),zoom=document.getElementById("crop-zoom");
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
  canvas.width=1920;canvas.height=1080;
  var ctx=canvas.getContext("2d");
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
  ctx.fillStyle="#0b0f14";ctx.fillRect(0,0,canvas.width,canvas.height);
  var p=getCropParams(canvas.width,canvas.height);
  ctx.drawImage(cropState.img,p.x,p.y,p.iw,p.ih);
  var out=canvas.toDataURL("image/jpeg",0.96);
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
  modelState={tris:tris,canvas:canvas,ctx:ctx,rotY:0,rotX:-0.28,auto:true,drag:false,lastX:0,lastY:0,raf:null,last:0};
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
function drawModel(){
  if(!modelState)return;
  var c=modelState.canvas,ctx=modelState.ctx,w=c.width,h=c.height,rotY=modelState.rotY,rotX=modelState.rotX;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--apple-bg2")||"#080d13";
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(10,132,255,.18)";
  ctx.lineWidth=1;
  for(var gx=0;gx<w;gx+=48){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}
  for(var gy=0;gy<h;gy+=48){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}
  var light={x:-.4,y:-.7,z:.8};
  var faces=modelState.tris.map(function(t){
    var pts=t.map(function(p){return rotatePoint(p,rotY,rotX);});
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
  ctx.fillText("Drag to tilt • double click to auto rotate",18,h-18);
}
function rotatePoint(p,ay,ax){
  var ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
  var x=p.x*ca-p.z*sa,z=p.x*sa+p.z*ca,y=p.y;
  var y2=y*cb-z*sb,z2=y*sb+z*cb;
  return {x:x,y:y2,z:z2};
}
function projectPoint(p,w,h){
  var d=2.4,scale=Math.min(w,h)*.82/(d+p.z);
  return {x:w/2+p.x*scale,y:h/2-p.y*scale};
}
function sub(a,b){return {x:a.x-b.x,y:a.y-b.y,z:a.z-b.z};}
function cross(a,b){return {x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x};}

async function askAI(){
  var input=document.getElementById("ai-input"),btn=document.getElementById("btn-run"),resp=document.getElementById("ai-response");
  var q=input.value.trim();if(!q)return;
  btn.disabled=true;btn.textContent="Processing...";
  resp.className="on";resp.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
  var summary="Christofer Rey Wijaya \u2014 Robotics & Automotive Engineering at Binus University (GPA "+DB.profile.gpa+"/4.00).\nPROJECTS: "+DB.projects.map(function(p){return p.title+": "+p.desc+" | Tech: "+(p.tags||[]).join(", ");}).join(" || ")+"\nAWARDS: "+DB.awards.map(function(a){return a.year+" "+a.name;}).join("; ")+"\nEXPERIENCE: "+DB.experience.map(function(e){return e.role+" at "+e.org;}).join("; ");
  var sys="You are an AI assistant for Christofer Rey Wijaya portfolio. Answer in Indonesian, professional and concise. Max 3-4 sentences.\n\nDATA:\n"+summary;
  try{
    var res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:q}]})});
    var data=await res.json();
    var text=data.content?data.content.map(function(c){return c.text||"";}).join(""):"Gagal memproses.";
    resp.innerHTML='<span style="color:var(--c);margin-right:8px;">\u203A</span>'+text;
  }catch(e){resp.innerHTML='<span style="color:var(--c);margin-right:8px;">\u203A</span>Database loaded. Tanya tentang Robot Dog, Shell Eco Marathon, AGV, atau proyek lainnya!';}
  btn.disabled=false;btn.textContent="Ask AI";
}
document.getElementById("ai-input").addEventListener("keydown",function(e){if(e.key==="Enter")askAI();});

function toast(msg,type){
  type=type||"ok";var t=document.getElementById("toast");t.textContent=msg;
  t.className="show"+(type==="err"?" err":"");
  setTimeout(function(){t.className="";},2800);
}
function observe(){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){
        setTimeout(function(){
          e.target.classList.add("on");
          var fill=e.target.querySelector(".sk-fill");
          if(fill){var p=parseFloat(fill.dataset.pct||1);fill.style.transform="scaleX("+p+")";fill.classList.add("on");}
        },i*55);
        io.unobserve(e.target);
      }
    });
  },{threshold:0.07});
  document.querySelectorAll(".reveal:not(.on)").forEach(function(el){io.observe(el);});
}
