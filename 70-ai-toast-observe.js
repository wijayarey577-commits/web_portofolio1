async function askAI(){
  var input=document.getElementById("ai-input"),btn=document.getElementById("btn-run"),resp=document.getElementById("ai-response");
  var q=input.value.trim();if(!q)return;
  btn.disabled=true;btn.textContent="Thinking...";
  resp.className="on";resp.innerHTML='<div class="typing"><span></span><span></span><span></span></div>';
  setTimeout(function(){
    resp.innerHTML='<span style="color:var(--c);margin-right:8px;">&#8250;</span>'+buildLocalAnswer(q);
    btn.disabled=false;btn.textContent="Ask AI";
  },180);
}
var aiInput=document.getElementById("ai-input");
if(aiInput)aiInput.addEventListener("keydown",function(e){if(e.key==="Enter")askAI();});

function normalizeText(value){
  return String(value||"").toLowerCase();
}
function tokenize(value){
  return normalizeText(value).replace(/[^\w\s-]/g," ").split(/\s+/).filter(function(w){return w.length>2;});
}
function projectText(p){
  return [p.title,p.desc,(p.tags||[]).join(" "),(p.cats||[]).join(" "),p.status,p.date].join(" ");
}
function itemScore(query,text){
  var words=tokenize(expandQuery(query));
  var hay=normalizeText(text);
  return words.reduce(function(total,w){return total+(hay.includes(w)?(w.length>4?2:1):0);},0);
}
function expandQuery(query){
  var q=normalizeText(query);
  var aliases=[
    ["sem","shell eco marathon"],["shell","shell eco marathon"],["eco","shell eco marathon"],
    ["kmhe","kontes mobil hemat energi electric prototype"],
    ["krti","kontes robot terbang indonesia drone vtol quadcopter"],
    ["agv","agricultural pick place autonomous navigation rplidar ros"],
    ["dog","robot dog quadruped kinematics"],
    ["anjing","robot dog quadruped kinematics"],
    ["arm","robotic arm scara prosthetic analog"],
    ["lengan","robotic arm scara prosthetic analog"],
    ["cfd","openfoam aerodynamics drag lift airflow simulation"],
    ["ev","electric vehicle battery chassis body energy efficiency"],
    ["mobil","electric vehicle prototype chassis body shell kmhe"],
    ["drone","vtol quadcopter gps rtk flight control"]
  ];
  aliases.forEach(function(pair){if(q.includes(pair[0]))q+=" "+pair[1];});
  return q;
}
function rankedProjects(q,limit){
  var rows=(DB.projects||[]).map(function(p){
    return {p:p,score:itemScore(q,projectText(p))};
  }).filter(function(row){return row.score>0;}).sort(function(a,b){return b.score-a.score;});
  return rows.slice(0,limit||3).map(function(row){return row.p;});
}
function formatProject(p,brief){
  var cats=Array.isArray(p.cats)?p.cats:[];
  var media=(p.images||[]).length+" gambar, "+(p.videos||[]).length+" video, "+(p.models||[]).length+" model 3D";
  var tech=(p.tags||[]).slice(0,5).join(", ");
  if(brief)return "<b>"+safeText(p.title)+"</b> ("+safeText(p.date||"-")+") - "+safeText(tech||cats.join(", "))+".";
  return "<b>"+safeText(p.title)+"</b> adalah project "+safeText(cats.join(", ")||"portfolio")+" berstatus <b>"+(p.status==="done"?"completed":"in progress")+"</b>. Fokus teknisnya: "+safeText(tech||"engineering prototype")+". "+safeText(p.desc)+" <br><span style=\"color:var(--muted)\">Media: "+safeText(media)+".</span>";
}
function projectListAnswer(projects,title){
  if(!projects.length)return "";
  return "<b>"+safeText(title)+"</b><br>"+projects.map(function(p,i){return (i+1)+". "+formatProject(p,true);}).join("<br>");
}
function categoryProjects(cat){
  return (DB.projects||[]).filter(function(p){
    var cats=Array.isArray(p.cats)?p.cats:[];
    return cats.includes(cat)||itemScore(cat,projectText(p))>0;
  });
}
function compareAnswer(q){
  if(!(q.includes("banding")||q.includes("compare")||q.includes(" vs ")||q.includes("beda")))return "";
  var matches=rankedProjects(q,4);
  if(matches.length<2)return "";
  var a=matches[0],b=matches[1];
  return "<b>Perbandingan singkat:</b><br>"+
    "1. "+formatProject(a,true)+" Fokus: "+safeText((a.desc||"").slice(0,170))+"...<br>"+
    "2. "+formatProject(b,true)+" Fokus: "+safeText((b.desc||"").slice(0,170))+"...<br>"+
    "Kesimpulan: <b>"+safeText(a.title)+"</b> lebih relevan untuk "+safeText((a.cats||[]).join("/"))+", sedangkan <b>"+safeText(b.title)+"</b> lebih kuat di "+safeText((b.tags||[]).slice(0,3).join(", "))+".";
}
function statsAnswer(){
  var projects=DB.projects||[],done=projects.filter(function(p){return p.status==="done";}).length;
  var wip=projects.length-done;
  var media=projects.reduce(function(acc,p){acc.images+=(p.images||[]).length;acc.videos+=(p.videos||[]).length;acc.models+=(p.models||[]).length;return acc;},{images:0,videos:0,models:0});
  return "Portfolio ini memuat <b>"+projects.length+" project</b>: "+done+" completed dan "+wip+" in progress. Media yang tersimpan: <b>"+media.images+" gambar</b>, <b>"+media.videos+" video</b>, dan <b>"+media.models+" model 3D</b>. Area dominan Christofer: robotics, EV, drone, CFD, dan embedded systems.";
}
function buildLocalAnswer(q){
  var query=normalizeText(q);
  var expanded=expandQuery(query);
  var compared=compareAnswer(expanded);
  if(compared)return compared;
  if(query.includes("berapa")||query.includes("jumlah")||query.includes("statistik")||query.includes("total")){
    return statsAnswer();
  }
  if(query.includes("kontak")||query.includes("contact")||query.includes("email")||query.includes("hubungi")){
    return "Kamu bisa menghubungi Christofer melalui email <b>christofer.wijaya@binus.ac.id</b>, LinkedIn, atau tombol contact di bagian bawah website.";
  }
  if(query.includes("cv")||query.includes("resume")){
    return "CV tersedia melalui tombol <b>Download CV</b> di hero dan section contact. Jika file belum terbuka, pastikan file <b>cv.pdf</b> sudah diupload ke root repository GitHub.";
  }
  if(query.includes("skill")||query.includes("stack")||query.includes("keahlian")){
    var top=(DB.skills||[]).slice().sort(function(a,b){return b.pct-a.pct;}).slice(0,4).map(function(s){return s.name+" ("+s.pct+"%)";}).join(", ");
    return "Skill utama Christofer meliputi <b>"+safeText(top)+"</b>. Tool yang sering digunakan antara lain "+safeText((DB.tools||[]).slice(0,8).join(", "))+".";
  }
  if(query.includes("sertifikat")||query.includes("certificate")||query.includes("certification")){
    var certNames=(DB.certs||[]).map(function(c){return typeof c==="string"?c:c.name;}).slice(0,6).join(", ");
    return "Sertifikasi dan dokumen pendukung yang tampil antara lain <b>"+safeText(certNames)+"</b>. Klik kartu sertifikat di website untuk melihat file yang sudah diupload.";
  }
  if(query.includes("award")||query.includes("achieve")||query.includes("prestasi")||query.includes("juara")){
    var awards=(DB.awards||[]).slice(0,4).map(function(a){return a.year+" - "+a.name;}).join("; ");
    return "Beberapa achievement utama: <b>"+safeText(awards)+"</b>. Detail lengkapnya ada di section Awards & Honors.";
  }
  if(query.includes("experience")||query.includes("pengalaman")||query.includes("kerja")||query.includes("magang")){
    var exp=(DB.experience||[]).slice(0,3).map(function(e){return e.role+" di "+e.org+" ("+e.period+")";}).join("; ");
    return "Pengalaman terbaru Christofer: <b>"+safeText(exp)+"</b>. Bagian Work & Experience menjelaskan tugas dan kontribusinya.";
  }
  var categoryMap=[
    {keys:["robot","robotic","robotics","agv","arm","lengan"],cat:"robotics",title:"Project robotics yang relevan"},
    {keys:["ev","electric","mobil","shell","kmhe","chassis","battery"],cat:"ev",title:"Project EV dan automotive yang relevan"},
    {keys:["drone","vtol","quadcopter","krti","terbang"],cat:"drone",title:"Project drone/UAV yang relevan"},
    {keys:["cfd","openfoam","aero","drag","lift","simulasi"],cat:"cfd",title:"Project CFD/simulasi yang relevan"},
    {keys:["competition","lomba","kompetisi"],cat:"competition",title:"Project kompetisi yang relevan"}
  ];
  for(var i=0;i<categoryMap.length;i++){
    if(categoryMap[i].keys.some(function(k){return expanded.includes(k);})){
      var list=categoryProjects(categoryMap[i].cat).slice(0,5);
      if(list.length)return projectListAnswer(list,categoryMap[i].title);
    }
  }
  var matches=rankedProjects(expanded,3);
  if(matches.length===1)return formatProject(matches[0],false);
  if(matches.length>1)return projectListAnswer(matches,"Project paling relevan dengan pertanyaanmu");
  return "Aku bisa bantu cari project, bandingkan project, rangkum skill, awards, experience, sertifikat, kontak, CV, atau media portfolio. Coba tanya lebih spesifik seperti <b>bandingkan Shell Eco Marathon dan KMHE</b>, <b>project robotics apa saja?</b>, atau <b>skill untuk AGV apa?</b>";
}

function sendContactMail(e){
  e.preventDefault();
  var name=document.getElementById("contact-name").value.trim();
  var email=document.getElementById("contact-email").value.trim();
  var message=document.getElementById("contact-message").value.trim();
  var subject=encodeURIComponent("Portfolio contact from "+name);
  var body=encodeURIComponent("Name: "+name+"\nEmail: "+email+"\n\nMessage:\n"+message);
  window.location.href="mailto:christofer.wijaya@binus.ac.id?subject="+subject+"&body="+body;
  toast("Opening email app...");
  e.target.reset();
}

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
