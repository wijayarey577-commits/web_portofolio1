var firebaseSyncReady=false;

function initFirebaseSync(){
  if(firebaseSyncReady)return true;
  if(!window.FIREBASE_CONFIG){
    return false;
  }
  if(!window.firebase||!firebase.initializeApp){
    return false;
  }
  try{
    if(!firebase.apps.length)firebase.initializeApp(window.FIREBASE_CONFIG);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebaseSyncReady=true;
    return true;
  }catch(err){
    console.warn("Firebase init failed",err);
    return false;
  }
}

function firebaseDataPath(){
  return window.FIREBASE_DATA_PATH||"portfolio/data";
}

async function ensureFirebaseDevAuth(){
  if(!initFirebaseSync()){
    toast("Firebase belum dikonfigurasi","err");
    return false;
  }
  if(firebase.auth().currentUser)return true;
  var email=localStorage.getItem("crw_firebase_email")||"";
  email=prompt("Firebase developer email:",email);
  if(!email)return false;
  var pass=prompt("Firebase password:");
  if(!pass)return false;
  try{
    await firebase.auth().signInWithEmailAndPassword(email,pass);
    localStorage.setItem("crw_firebase_email",email);
    return true;
  }catch(err){
    alert("Login Firebase gagal:\n\n"+(err&&err.message?err.message:err));
    return false;
  }
}

async function loadFirebaseDatabase(silent){
  if(!initFirebaseSync()){
    if(!silent)toast("Firebase config belum diisi","err");
    return false;
  }
  try{
    var snap=await firebase.database().ref(firebaseDataPath()).get();
    if(!snap.exists())throw new Error("Firebase data not found");
    var parsed=snap.val();
    var imported=parsed.data||parsed;
    var remoteTime=Date.parse(imported.updatedAt||parsed.exportedAt||0);
    var localTime=Date.parse(DB.updatedAt||0);
    if(silent&&localTime&&remoteTime&&localTime>remoteTime)return false;
    DB=mergeImportedDB(imported);
    saveDB(true);
    renderAll();
    if(currentDetailId)openDetail(currentDetailId);
    if(!silent)toast("Firebase data loaded");
    return true;
  }catch(err){
    if(!silent)toast("Firebase data belum ada atau rules belum benar","err");
    return false;
  }
}

async function publishDatabaseToFirebase(){
  if(!isDevMode){
    toast("Developer access only","err");
    return;
  }
  if(!(await ensureFirebaseDevAuth()))return;
  try{
    DB.updatedAt=new Date().toISOString();
    var payload={app:"crw-portfolio",version:10,exportedAt:new Date().toISOString(),data:DB};
    await firebase.database().ref(firebaseDataPath()).set(payload);
    saveDB(true);
    toast("Saved to Firebase. Browser lain tinggal refresh.");
  }catch(err){
    alert("Save Firebase gagal:\n\n"+(err&&err.message?err.message:err)+"\n\nCek Realtime Database rules dan login Firebase developer.");
  }
}
