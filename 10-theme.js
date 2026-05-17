function initTheme(){
  var saved=localStorage.getItem(THEME_KEY);
  if(saved!=="light"&&saved!=="dark")saved="dark";
  applyTheme(saved);
}
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme",theme);
  var icon=document.getElementById("theme-icon");
  if(icon)icon.textContent=theme==="light"?"Light":"Dark";
}
function toggleTheme(){
  var current=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";
  var next=current==="light"?"dark":"light";
  localStorage.setItem(THEME_KEY,next);
  applyTheme(next);
}
