// main.js - theme, device info, small utilities
(function(){
  // Theme toggle
  const root = document.documentElement;
  const saved = localStorage.getItem('jawir_theme');
  if(saved) document.documentElement.setAttribute('data-theme', saved);
  const toggle = document.getElementById('toggleTheme');
  if(toggle) toggle.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('jawir_theme', cur);
  });

  // Floating WA position fix already via CSS (fixed)

  // Inject DATA if not present
  if(!window.DATAFEATURES) window.DATAFEATURES = [];

  // Device info: IP
  async function loadIP(){
    try{
      const r = await fetch('https://api.ipify.org?format=json');
      const j = await r.json();
      window.USER_IP = j.ip;
    }catch(e){window.USER_IP = 'unknown'}
  }
  loadIP();

  // Battery
  if(navigator.getBattery) navigator.getBattery().then(b=>{window.USER_BATTERY = Math.round(b.level*100)});
  // Connection
  window.USER_CONNECTION = (navigator.connection && navigator.connection.effectiveType) ? navigator.connection.effectiveType : 'unknown';

  // Small util to show notifications (simple)
  window.jNotify = function(msg){
    alert(msg);
  }
})();
