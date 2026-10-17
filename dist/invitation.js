
'use strict';
(() => {
 const overlay=document.getElementById('weiOverlay'),video=document.getElementById('weiVideo'),wrap=document.getElementById('weiVideoWrap'),audio=document.getElementById('weiAudio'),audioBtn=document.getElementById('weiAudioBtn'),pause=document.getElementById('weiIconPause'),play=document.getElementById('weiIconPlay');
 let started=false,revealing=false,failTimer;
 document.body.classList.add('invitation-closed');
 function syncAudio(){const active=!audio.paused;pause.style.display=active?'block':'none';play.style.display=active?'none':'block';audioBtn.setAttribute('aria-label',active?'Pause music':'Play music');audioBtn.setAttribute('aria-pressed',String(active));}
 function finish(){
  if(revealing)return;revealing=true;clearTimeout(failTimer);
  overlay.style.opacity='0';overlay.style.pointerEvents='none';
  wrap.classList.remove('wei-video-in');wrap.classList.add('wei-video-out');
  document.body.classList.add('invitation-revealed');
  // Keep the clip moving through its fade; pause only once fully hidden.
  setTimeout(()=>{video.pause();wrap.style.display='none';overlay.style.display='none';document.body.classList.remove('invitation-closed');},900);
  audioBtn.style.visibility='visible';audioBtn.style.opacity='1';syncAudio();
 }
 function showVideo(){if(!started||revealing)return;wrap.classList.add('wei-video-in');overlay.style.opacity='0';overlay.style.pointerEvents='none';setTimeout(()=>{overlay.style.display='none';},350);}
 function open(){
  if(started)return;started=true;window.scrollTo(0,0);overlay.setAttribute('aria-disabled','true');
  audio.play().catch(syncAudio);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
  document.getElementById('weiTapLabel').textContent='Opening your invitation';
  video.currentTime=0;failTimer=setTimeout(finish,10000);
  video.play().catch(finish);
 }
 overlay.addEventListener('click',open);overlay.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 video.addEventListener('playing',showVideo);video.addEventListener('ended',finish);video.addEventListener('error',()=>{if(started)finish();});
 video.addEventListener('timeupdate',()=>{if(started&&video.duration&&video.currentTime>=video.duration-.65)finish();});
 document.getElementById('skip-intro').addEventListener('click',finish);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started&&!revealing)finish();});
 audioBtn.addEventListener('click',()=>{if(audio.paused)audio.play().catch(syncAudio);else audio.pause();});audio.addEventListener('play',syncAudio);audio.addEventListener('pause',syncAudio);
 const dialog=document.getElementById('rsvp-dialog'),trigger=document.getElementById('open-rsvp');
 trigger.addEventListener('click',e=>{e.preventDefault();dialog.showModal();});document.getElementById('close-rsvp').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>trigger.focus());
 const attending=document.getElementById('attendance'),count=document.getElementById('guest-count');attending.addEventListener('change',()=>{document.getElementById('guest-count-wrap').hidden=attending.value==='no';count.disabled=attending.value==='no';});
 document.getElementById('rsvp-form').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('guest-name').value.trim();if(!name)return;const response=attending.value==='yes'?`I am delighted to attend with a total of ${Number(count.value)} guest${Number(count.value)===1?'':'s'}, including myself.`:'With regret, I will be unable to attend. Sending my warm wishes and duas.';document.getElementById('rsvp-message').value=`Assalamu Alaikum Zeeshan Ansari, this is ${name}. Thank you for inviting me to Muhammad Ahsan Khan and Filzah Ansari’s Nikkah on 18 November 2026 at Opium Banquet. ${response}`;document.getElementById('rsvp-result').hidden=false;document.getElementById('rsvp-message').focus();});
 document.getElementById('copy-rsvp').addEventListener('click',async()=>{const field=document.getElementById('rsvp-message');try{await navigator.clipboard.writeText(field.value);document.getElementById('copy-status').textContent='Copied. Please send the message to Zeeshan Ansari to confirm your RSVP.';}catch{field.focus();field.select();document.getElementById('copy-status').textContent='Select and copy the message above, then send it to Zeeshan Ansari.';}});
})();
