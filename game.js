(() => {
  "use strict";

  const SAVE_KEY = "tien-lo-khoi-nguyen-save-v1";
  const maps = [
    {id:0,name:"Rừng Tân Thủ",icon:"🌲",minLevel:1,enemy:"Sói Xám",enemyIcon:"🐺",desc:"Yêu thú cấp thấp thường xuất hiện ở rìa rừng.",hp:40,attack:4,xp:12,gold:7},
    {id:1,name:"Suối Linh Khê",icon:"💧",minLevel:3,enemy:"Thủy Tinh",enemyIcon:"🦎",desc:"Sinh vật hấp thụ linh khí bên dòng suối.",hp:95,attack:8,xp:22,gold:13},
    {id:2,name:"Hang Hỏa Nham",icon:"🌋",minLevel:6,enemy:"Hỏa Nham Quái",enemyIcon:"👹",desc:"Quái vật có lớp giáp đá nóng rực.",hp:190,attack:14,xp:38,gold:22},
    {id:3,name:"Rừng Trúc U Minh",icon:"🎋",minLevel:10,enemy:"Ảnh Miêu",enemyIcon:"🐈‍⬛",desc:"Yêu miêu ẩn hiện trong màn sương tím.",hp:360,attack:22,xp:65,gold:35},
    {id:4,name:"Cổ Điện Thiên Cơ",icon:"🏯",minLevel:15,enemy:"Thủ Hộ Cổ Điện",enemyIcon:"🗿",desc:"Cổ thú canh giữ di tích của một tông môn xưa.",hp:720,attack:34,xp:110,gold:60},
    {id:5,name:"Đỉnh Vân Tiêu",icon:"⛰️",minLevel:22,enemy:"Vân Long",enemyIcon:"🐉",desc:"Linh thú cổ đại thử thách kẻ muốn bước lên tiên lộ.",hp:1500,attack:52,xp:190,gold:100}
  ];
  const realms = [
    {name:"Phàm nhân",need:0},
    {name:"Luyện Khí",need:80},
    {name:"Trúc Cơ",need:260},
    {name:"Kim Đan",need:700},
    {name:"Nguyên Anh",need:1600},
    {name:"Hóa Thần",need:3600},
    {name:"Độ Kiếp",need:8000}
  ];
  const gearPool = {
    weapon:[{name:"Kiếm gỗ",bonus:0},{name:"Thiết kiếm",bonus:4},{name:"Kiếm Thanh Phong",bonus:9},{name:"Hỏa Vân Kiếm",bonus:17},{name:"Trảm Yêu Kiếm",bonus:30},{name:"Thiên Cơ Thần Kiếm",bonus:52}],
    armor:[{name:"Áo vải",bonus:0},{name:"Giáp da",bonus:2},{name:"Pháp y Thanh Trúc",bonus:5},{name:"Giáp Hỏa Nham",bonus:10},{name:"Bào U Minh",bonus:17},{name:"Thiên Vân Tiên Giáp",bonus:27}],
    charm:[{name:"Ngọc bình an",bonus:0},{name:"Linh phù nhỏ",bonus:2},{name:"Ngọc Linh Khê",bonus:5},{name:"Hỏa linh châu",bonus:9},{name:"U Minh bảo ngọc",bonus:15},{name:"Long hồn châu",bonus:24}]
  };
  const freshState = () => ({
    name:"Tiểu Đạo Sĩ", level:1, xp:0, gold:0, cultivation:0, hp:100,
    map:0, kills:0, totalKills:0, weapon:0, armor:0, charm:0,
    lastSeen:Date.now(), enemyHp:null, enemyMaxHp:null, bossMode:false
  });
  let state = loadState();
  let lastTick = Date.now();
  let logItems = [];

  const $ = id => document.getElementById(id);
  const fmt = n => Math.floor(n).toLocaleString("vi-VN");
  const currentMap = () => maps[state.map];
  const enemyMax = () => Math.floor(currentMap().hp * (1 + Math.max(0,state.level-currentMap().minLevel)*0.12) * (state.bossMode ? 3 : 1));
  const playerAttack = () => 10 + state.level*2 + gearPool.weapon[state.weapon].bonus + gearPool.charm[state.charm].bonus + Math.floor(state.cultivation/180);
  const playerDefense = () => 2 + Math.floor(state.level/2) + gearPool.armor[state.armor].bonus;
  const maxHp = () => 90 + state.level*10 + playerDefense()*2;
  const realm = () => [...realms].reverse().find(r => state.cultivation >= r.need) || realms[0];

  function loadState(){
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return freshState();
      const parsed = JSON.parse(raw);
      const base = {...freshState(), ...parsed};
      base.level = Math.max(1, Number(base.level)||1);
      base.map = Math.max(0, Math.min(maps.length-1, Number(base.map)||0));
      base.hp = Math.max(1, Math.min(Number(base.hp)||100, 100000));
      base.lastSeen = Number(base.lastSeen)||Date.now();
      return base;
    } catch (_) { return freshState(); }
  }
  function saveState(){
    state.lastSeen = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); $("saveStatus").textContent = "Đã lưu " + new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}); }
    catch (_) { $("saveStatus").textContent = "Không thể lưu trên trình duyệt này"; }
  }
  function addLog(message,type=""){
    const time = new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit","second":"2-digit"});
    logItems.unshift({message,time,type}); logItems = logItems.slice(0,30);
    $("log").innerHTML = logItems.map(x=>`<div class="log-entry ${x.type}"><span style="color:#85819f">${x.time}</span> · ${escapeHtml(x.message)}</div>`).join("");
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function setEnemy(){
    state.enemyMaxHp = enemyMax();
    state.enemyHp = state.enemyMaxHp;
  }
  function maybeSetEnemy(){if(!Number.isFinite(state.enemyHp)||!Number.isFinite(state.enemyMaxHp)||state.enemyHp<=0){setEnemy();}}
  function renderMaps(){
    $("mapList").innerHTML = maps.map(m=>{
      const unlocked = state.level >= m.minLevel;
      return `<button class="map-card ${m.id===state.map?"active":""} ${unlocked?"":"locked"}" data-map="${m.id}" ${unlocked?"":"disabled"}><span class="map-art">${m.icon}</span><span><strong>${m.name}</strong><small>${unlocked?"Cấp đề xuất "+m.minLevel+"+":"Mở ở cấp "+m.minLevel}</small></span></button>`;
    }).join("");
    document.querySelectorAll("[data-map]").forEach(btn=>btn.addEventListener("click",()=>travel(Number(btn.dataset.map))));
  }
  function render(){
    maybeSetEnemy();
    const m=currentMap(), eMax=state.enemyMaxHp, eHp=state.enemyHp;
    $("playerName").textContent=state.name;
    $("realmBadge").textContent=realm().name;
    $("levelText").textContent=`Cấp ${state.level} · Chiến lực ${fmt(playerAttack()+playerDefense()*2)}`;
    $("xpText").textContent=`${fmt(state.xp)} / ${fmt(xpNeeded())} EXP`;
    $("xpBar").style.width=Math.min(100,state.xp/xpNeeded()*100)+"%";
    $("hpText").textContent=`${fmt(state.hp)} / ${fmt(maxHp())}`;
    $("hpBar").style.width=Math.max(0,Math.min(100,state.hp/maxHp()*100))+"%";
    $("attackStat").textContent=fmt(playerAttack());
    $("defenseStat").textContent=fmt(playerDefense());
    $("goldStat").textContent=fmt(state.gold);
    $("cultivationStat").textContent=fmt(state.cultivation);
    $("mapBadge").textContent=m.name;
    $("mapTitle").textContent=m.name;
    $("mapLevel").textContent="Cấp đề xuất "+m.minLevel+"+";
    $("enemyName").textContent=state.bossMode?"Boss: "+m.enemy:m.enemy;
    $("enemyIcon").textContent=state.bossMode?"👑":m.enemyIcon;
    $("enemySprite").textContent=state.bossMode?"👑":m.enemyIcon;
    $("enemyDesc").textContent=state.bossMode?"Thử thách mạnh mẽ với phần thưởng lớn hơn.":m.desc;
    $("enemyHpText").textContent=`${fmt(eHp)} / ${fmt(eMax)}`;
    $("enemyHpBar").style.width=Math.max(0,eHp/eMax*100)+"%";
    $("enemyCount").textContent="Đã hạ: "+fmt(state.totalKills);
    $("weaponName").textContent=gearPool.weapon[state.weapon].name;
    $("weaponBonus").textContent="+"+gearPool.weapon[state.weapon].bonus+" công kích";
    $("armorName").textContent=gearPool.armor[state.armor].name;
    $("armorBonus").textContent="+"+gearPool.armor[state.armor].bonus+" phòng ngự";
    $("charmName").textContent=gearPool.charm[state.charm].name;
    $("charmBonus").textContent="+"+gearPool.charm[state.charm].bonus+" công kích";
    renderMaps();
  }
  function xpNeeded(){return Math.floor(25 + state.level*18 + Math.pow(state.level,1.35)*4);}
  function gainXp(amount){
    state.xp += amount;
    while(state.xp>=xpNeeded()){
      state.xp-=xpNeeded();state.level++;
      state.hp=Math.min(maxHp(),state.hp+30);
      addLog(`Đột phá lên cấp ${state.level}! Sinh lực được hồi phục.`, "good");
      if(state.level%3===0) addLog("Một vùng đất mới có thể đã mở khóa.", "warn");
    }
  }
  function maybeDropGear(){
    const chance=Math.min(.5,.12+state.map*.04+(state.bossMode?.2:0));
    if(Math.random()>chance)return;
    const type=["weapon","armor","charm"][Math.floor(Math.random()*3)];
    const pool=gearPool[type], current=state[type];
    if(current<pool.length-1 && Math.random()<.72){
      state[type]=Math.min(pool.length-1,Math.max(current+1,Math.min(pool.length-1,state.map+1)));
      $("lootText").textContent=`Nhận ${pool[state[type]].name} (${type==="weapon"?"tăng công kích":type==="armor"?"tăng phòng ngự":"tăng công kích"})!`;
      addLog("Nhặt được trang bị: "+pool[state[type]].name+"!", "good");
    }else{
      const bonus=10+state.map*8;
      state.gold+=bonus;$("lootText").textContent=`Không có trang bị mới, đổi thành ${bonus} linh thạch.`;
    }
  }
  function defeatEnemy(){
    const m=currentMap();
    const xp=Math.floor(m.xp*(state.bossMode?4:1));
    const gold=Math.floor(m.gold*(state.bossMode?5:1)*(0.8+Math.random()*.5));
    state.gold+=gold;gainXp(xp);state.cultivation+=Math.floor(xp*.6)+(state.bossMode?25:0);
    state.kills++;state.totalKills++;
    addLog(`Đánh bại ${state.bossMode?"Boss ":""}${m.enemy}: +${xp} EXP, +${gold} linh thạch.`, "good");
    $("battleText").textContent=`Chiến thắng! +${xp} EXP · +${gold} 🪙`;
    maybeDropGear();
    if(state.bossMode){state.bossMode=false;addLog("Boss đã bị khuất phục! Phần thưởng tu vi đặc biệt đã nhận.","good");}
    setEnemy();state.hp=Math.min(maxHp(),state.hp+Math.ceil(maxHp()*.06));
    render();saveState();
  }
  function combatTick(){
    if(state.hp<=0){state.hp=1;addLog("Bạn đã kiệt sức. Hãy dùng hồi phục để tiếp tục.", "warn");render();return;}
    maybeSetEnemy();
    const dmg=playerAttack()*(state.bossMode?1:1);
    state.enemyHp-=dmg;
    $("damageFloat").textContent="-"+fmt(dmg);
    $("damageFloat").classList.remove("show"); void $("damageFloat").offsetWidth; $("damageFloat").classList.add("show");
    if(state.enemyHp<=0){defeatEnemy();return;}
    const m=currentMap();
    const incoming=Math.max(1,m.attack+Math.floor(state.level*.4)-playerDefense());
    state.hp=Math.max(0,state.hp-incoming);
    if(state.hp<=0){state.hp=1;addLog("Bạn tạm lùi lại dưỡng thương. Dùng nút hồi phục để chiến đấu tiếp.", "warn");$("battleText").textContent="Đang dưỡng thương...";}
    else $("battleText").textContent=`Bạn gây ${fmt(dmg)} sát thương · nhận ${fmt(incoming)} sát thương`;
    render();
  }
  function travel(id){
    if(state.level<maps[id].minLevel){addLog("Cấp độ chưa đủ để đến khu vực này.","warn");return;}
    state.map=id;state.bossMode=false;setEnemy();state.hp=Math.min(maxHp(),state.hp+20);
    addLog("Bạn đã đến "+maps[id].name+".","good");render();saveState();
  }
  function cultivate(){
    const amount=12+state.level*3;
    state.cultivation+=amount;gainXp(Math.floor(amount*.45));
    state.hp=Math.min(maxHp(),state.hp+Math.floor(maxHp()*.12));
    addLog(`Tĩnh tâm vận khí: +${amount} tu vi, hồi phục sinh lực.`, "good");
    render();saveState();
  }
  function heal(){
    const cost=20;
    if(state.gold<cost){addLog("Không đủ linh thạch để mua linh dược.","warn");return;}
    if(state.hp>=maxHp()){addLog("Sinh lực đang đầy, chưa cần hồi phục.");return;}
    state.gold-=cost;state.hp=Math.min(maxHp(),state.hp+Math.ceil(maxHp()*.5));
    addLog("Dùng linh dược, sinh lực được hồi phục.","good");render();saveState();
  }
  function startBoss(){
    if(state.bossMode){addLog("Boss đã xuất hiện, hãy tiếp tục chiến đấu.");return;}
    state.bossMode=true;setEnemy();addLog("Boss "+currentMap().enemy+" xuất hiện! Phần thưởng cao hơn nhưng rất nguy hiểm.","warn");render();
  }
  $("cultivateBtn").addEventListener("click",cultivate);
  $("healBtn").addEventListener("click",heal);
  $("saveBtn").addEventListener("click",()=>{saveState();addLog("Đã lưu tiến trình.","good");});
  $("resetBtn").addEventListener("click",()=>{
    if(confirm("Bạn chắc chắn muốn xóa tiến trình và chơi lại từ đầu?")){
      localStorage.removeItem(SAVE_KEY);state=freshState();setEnemy();logItems=[];$("log").innerHTML="";$("lootText").textContent="Chưa có chiến lợi phẩm.";addLog("Hành trình tu tiên mới bắt đầu.");render();saveState();
    }
  });
  $("clearLogBtn").addEventListener("click",()=>{logItems=[];$("log").innerHTML="";});
  // Nhấn đúp vào thẻ yêu thú để triệu hồi Boss khu vực.
  $("enemyIcon").title="Nhấn đúp để triệu hồi Boss khu vực";
  $("enemyIcon").style.cursor="pointer";
  $("enemyIcon").addEventListener("dblclick",startBoss);
  $("enemySprite").style.cursor="pointer";
  $("enemySprite").title="Nhấn đúp để triệu hồi Boss khu vực";
  $("enemySprite").addEventListener("dblclick",startBoss);

  // Tiến trình ngoại tuyến: nhận một phần phần thưởng khi mở game lại.
  const awayMs=Math.max(0,Math.min(Date.now()-(state.lastSeen||Date.now()),8*60*60*1000));
  if(awayMs>60000){
    const ticks=Math.floor(awayMs/3000), rewards=Math.min(ticks,600);
    const xp=Math.floor(rewards*(currentMap().xp*.22));
    const gold=Math.floor(rewards*(currentMap().gold*.22));
    state.gold+=gold;gainXp(xp);state.cultivation+=Math.floor(xp*.5);
    addLog(`Tu luyện ngoại tuyến: +${xp} EXP, +${gold} linh thạch.`, "good");
  }
  maybeSetEnemy();
  addLog("Tiên lộ đã mở. Nhân vật sẽ tự động chiến đấu mỗi giây.");
  render();saveState();
  setInterval(()=>{combatTick();if(Math.random()<.035)state.cultivation+=1;saveState();},1000);
})();
