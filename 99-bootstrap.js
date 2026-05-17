loadDB();
initTheme();
renderAll();
initMisc();
loadFirebaseDatabase(true).then(function(loaded){
  if(!loaded)loadRemoteDatabase(true);
});
