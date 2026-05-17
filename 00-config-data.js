var CREDS={user:"rey",pass:"kontol"};
var SK="crw_pf_v7";
var THEME_KEY="crw_theme";
var GH_TOKEN_KEY="crw_github_sync_token";
var isDevMode=false,DB={},modalType=null,editingId=null,currentDetailId=null,cropState=null,modelState=null,editingToolIcon=null;
var MODEL_MAX_TRIANGLES=6500;
var MODEL_MAX_FILE_BYTES=2500000;
var VIDEO_MAX_FILE_BYTES=25000000;

var DEFAULT={
  updatedAt:"2026-05-17T00:00:00.000Z",
  sync:{branch:"main",path:"portfolio-data.json"},
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
  softwareTools:["SolidWorks","Inventor","Ansys","OpenFOAM","ROS","Python","C++","TensorFlow","MATLAB","Android Studio","Firebase","KiCad"],
  hardwareTools:["Raspberry Pi","STM32","ROS 2","Keras","Arduino","ESP32","HTML/CSS/JS","Blynk","Linux","RPLidar","PID Control"],
  tools:["Raspberry Pi","STM32","ROS","ROS 2","TensorFlow","Keras","OpenFOAM","SolidWorks","Inventor","Ansys","KiCad","MATLAB","Arduino","ESP32","Python","C++","HTML/CSS/JS","Android Studio","Blynk","Firebase","Linux","RPLidar","PID Control"],
  contactLinks:[
    {id:1,icon:"\u260E",label:"PHONE",value:"+62-831-5512-7780",href:"tel:+6283155127780",target:false,type:"link"},
    {id:2,icon:"@",label:"EMAIL",value:"christofer.wijaya@binus.ac.id",href:"mailto:christofer.wijaya@binus.ac.id",target:false,type:"link"},
    {id:3,icon:"in",label:"LINKEDIN",value:"christofer-rey-wijaya",href:"https://linkedin.com/in/christofer-rey-wijaya-04a049396",target:true,type:"link"},
    {id:4,icon:"\uD83D\uDCC1",label:"PORTFOLIO DRIVE",value:"Google Drive \u00B7 Certificates & Projects",href:"https://drive.google.com/drive/folders/1T5JUR9uZIroUh4u9SWQNj27MXeoOEWyc?usp=sharing",target:true,type:"link"},
    {id:5,icon:"CV",label:"CV DOWNLOAD",value:"Download resume PDF for recruiters",href:"cv.pdf",target:false,type:"cv"}
  ],
  contactAbout:'<p>Hi! Saya <strong>Christofer Rey Wijaya</strong>, mahasiswa Automotive &amp; Robotics Engineering di Binus University, menuju kelulusan September 2027.</p><p>Aktif di kompetisi internasional (<strong>Shell Eco Marathon Qatar</strong>) dan nasional (KMHE, KRTI). Saat ini magang sebagai <strong>CAE Engineer</strong> di PT. Kalbe Morinaga Indonesia.</p><p>Terbuka untuk kolaborasi riset, proyek engineering, maupun peluang karir.</p><p style="color:var(--c2)"><strong>Status: Open for Opportunities &#x2713;</strong></p>',
  certLink:{label:"View All Certificates",href:"https://drive.google.com/drive/folders/1T5JUR9uZIroUh4u9SWQNj27MXeoOEWyc?usp=sharing",target:true},
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
    DB.sync=Object.assign({},base.sync||{},saved.sync||{});
    DB.cvFile=saved.cvFile||base.cvFile||null;
    DB.contactAbout=saved.contactAbout||base.contactAbout;
    DB.certLink=Object.assign({},base.certLink||{},saved.certLink||{});
    DB.toolIcons=Object.assign({},base.toolIcons||{},saved.toolIcons||{});
    ["awards","skills","tools","softwareTools","hardwareTools","contactLinks","projects","experience","certs"].forEach(function(key){
      if(!Array.isArray(DB[key]))DB[key]=base[key];
    });
    DB.projects=DB.projects.map(function(p){
      if(!Array.isArray(p.images))p.images=[];
      if(!Array.isArray(p.videos))p.videos=[];
      if(!Array.isArray(p.models))p.models=[];
      return p;
    });
    DB.certs=(DB.certs||[]).map(function(c,i){return typeof c==="string"?{id:i+1,name:c,file:null}:c;});
  }else{
    DB=base;
  }
}
function saveDB(skipTouch){
  if(!skipTouch)DB.updatedAt=new Date().toISOString();
  try{
    localStorage.setItem(SK,JSON.stringify(DB));
    return true;
  }catch(err){
    try{localStorage.removeItem(SK);}catch(e){}
    console.warn("Local database cache skipped because browser storage is full.",err);
    return false;
  }
}
function nextId(arr){return arr.length?Math.max.apply(null,arr.map(function(x){return x.id;}))+1:1;}
