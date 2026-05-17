function initMisc(){
  if(!("ontouchstart" in window)){
    var c=document.getElementById("cur"),r=document.getElementById("cur-ring");
    if(c&&r){
      var cursor={x:innerWidth/2,y:innerHeight/2,rx:innerWidth/2,ry:innerHeight/2,lastTrail:0,hover:false};
      function animateCursor(){
        cursor.rx+=(cursor.x-cursor.rx)*0.18;
        cursor.ry+=(cursor.y-cursor.ry)*0.18;
        c.style.left=cursor.x+"px";c.style.top=cursor.y+"px";
        r.style.left=cursor.rx+"px";r.style.top=cursor.ry+"px";
        requestAnimationFrame(animateCursor);
      }
      animateCursor();
      document.addEventListener("mousemove",function(e){
        cursor.x=e.clientX;cursor.y=e.clientY;
        var now=performance.now();
        if(now-cursor.lastTrail>34&&!cursor.hover){
          cursor.lastTrail=now;
          var t=document.createElement("span");
          t.className="cursor-trail";
          t.style.left=e.clientX+"px";t.style.top=e.clientY+"px";
          document.body.appendChild(t);
          setTimeout(function(){t.remove();},720);
        }
      });
    }
    document.querySelectorAll("a,button,input,select,textarea").forEach(function(el){
      el.addEventListener("mouseenter",function(){if(r&&c){cursor.hover=true;r.style.width="58px";r.style.height="58px";r.style.borderColor="var(--c2)";c.style.opacity="0";}});
      el.addEventListener("mouseleave",function(){if(r&&c){cursor.hover=false;r.style.width="38px";r.style.height="38px";r.style.borderColor="rgba(0,212,255,.75)";c.style.opacity="1";}});
    });
  }else{["cur","cur-ring"].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display="none";});}
  window.addEventListener("scroll",function(){
    var bar=document.getElementById("prog");
    if(bar){var p=(scrollY/(document.body.scrollHeight-innerHeight))*100;bar.style.width=p+"%";}
    updateActiveNav();
  });
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
  updateActiveNav();
}

function updateActiveNav(){
  var ids=["home","awards","skills","projects","experience","certs","timeline","contact"];
  var y=window.scrollY+Math.max(110,window.innerHeight*.28);
  var current="home";
  ids.forEach(function(id){
    var sec=document.getElementById(id);
    if(sec&&sec.offsetTop<=y)current=id;
  });
  document.querySelectorAll(".nav-center a,.mob-nav a").forEach(function(a){
    var href=(a.getAttribute("href")||"").replace("#","");
    a.classList.toggle("active",href===current);
  });
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

function handleCVClick(e){
  if(!isDevMode)return;
  e.preventDefault();
  if(DB.cvFile){
    if(confirm("CV sudah diupload: "+(DB.cvFile.name||"CV PDF")+".\n\nOK = upload/ganti CV\nCancel = pilihan hapus")){
      document.getElementById("cv-upload-input").click();
    }else if(confirm("Hapus CV yang sudah diupload? Guest akan kembali memakai cv.pdf default.")){
      DB.cvFile=null;
      saveDB();
      renderCVLinks();
      toast("Uploaded CV deleted");
    }
  }else{
    document.getElementById("cv-upload-input").click();
  }
}
async function uploadCVFile(e){
  if(!isDevMode)return;
  var file=e.target.files&&e.target.files[0];
  if(!file)return;
  if(!/\.pdf$/i.test(file.name)&&file.type!=="application/pdf"){toast("Upload PDF only","err");e.target.value="";return;}
  if(file.size>5000000&&!confirm("File CV lebih dari 5MB dan bisa membuat database berat. Tetap upload?")){e.target.value="";return;}
  try{
    var src=await readFileAsDataURL(file);
    DB.cvFile={name:file.name,size:file.size,type:file.type||"application/pdf",src:src,uploadedAt:new Date().toISOString()};
    saveDB();
    renderCVLinks();
    toast("CV uploaded for guest download");
  }catch(err){
    toast("Failed to upload CV","err");
  }
  e.target.value="";
}
