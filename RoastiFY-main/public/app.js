const feed = document.querySelector(".feed");
const fileInput = document.getElementById("fileInput");
const roastBox = document.getElementById("roastBox");
const roastText = document.getElementById("roastText");
const roastCounter = document.getElementById("roastCounter");

let totalRoasts = Number(localStorage.getItem("totalRoasts") || "2847392");
let freeUsed = Number(localStorage.getItem("freeRoastsUsed") || "0");
updateCounters();

// Create starter cards
const cards = [
  heroCard(),
  tipCard("Pro tip", "Swipe up/down to see roasts, upload a pic, then share to go viral."),
  tipCard("Savage Mode", "Unlock premium for brutal, celebrity‑style roasts.")
];
cards.forEach(c => feed.appendChild(c));

function heroCard(){
  const c = document.createElement("section");
  c.className = "card";
  c.innerHTML = `
    <div class="card-inner">
      <div class="badge">TRENDING</div>
      <div class="title">🔥 AI ROAST MASTER 🔥</div>
      <div class="subtitle">Upload your photo and get absolutely DESTROYED by AI!</div>
      <div class="stats">
        <div class="stat"><span class="n" id="statRoasts">${totalRoasts.toLocaleString()}</span>Roasts</div>
        <div class="stat"><span class="n">4.8★</span>Rating</div>
        <div class="stat"><span class="n">97%</span>Laughs</div>
      </div>
      <label class="upload" for="fileInput">
        <div class="big">📸</div>
        <div>Tap to upload a photo</div>
        <div style="opacity:.8;font-size:12px;margin-top:4px">JPG/PNG up to 10MB</div>
      </label>
      <div class="controls">
        <button class="btn" id="freeBtn">🔥 FREE ROAST</button>
        <button class="btn gold" id="proBtn">💎 SAVAGE MODE</button>
      </div>
      <div class="roast" id="roastBox">
        <div id="roastText"></div>
      </div>
      <div class="watermark">Powered by SuperCool.com</div>
      <input type="file" id="fileInput" accept="image/*" hidden />
    </div>
  `;
  // wire buttons
  c.querySelector("#freeBtn").addEventListener("click", () => onRoast("free"));
  c.querySelector("#proBtn").addEventListener("click", openPaywall);
  c.querySelector("#fileInput").addEventListener("change", onFile);
  return c;
}

function tipCard(h, p){
  const c = document.createElement("section");
  c.className = "card";
  c.innerHTML = `
    <div class="card-inner">
      <div class="title">${h}</div>
      <div class="subtitle" style="margin-top:6px">${p}</div>
    </div>`;
  return c;
}

function onFile(e){
  const f = e.target.files[0];
  if(!f){ return; }
  // show filename
  const up = document.querySelector(".upload");
  if(up){ up.querySelector("div:nth-child(2)").textContent = `Ready: ${f.name}`; }
}

async function onRoast(type){
  // Enforce free daily limit
  if(type === "free" && freeUsed >= 3){
    openPaywall();
    return;
  }
  setLoading(true);
  try{
    const r = await fetch("/api/roast", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ type })
    });
    const data = await r.json();
    roastText.textContent = data.roast || "Done.";
    roastBox.classList.add("show");
    totalRoasts += 1;
    localStorage.setItem("totalRoasts", String(totalRoasts));
    updateCounters();
    if(type === "free"){
      freeUsed += 1;
      localStorage.setItem("freeRoastsUsed", String(freeUsed));
    }
  }catch(err){
    roastText.textContent = "Server took one look at your pic and fainted. Try again.";
    roastBox.classList.add("show");
  }finally{
    setLoading(false);
  }
}

function setLoading(v){
  const btn = document.getElementById("freeBtn");
  if(btn){
    btn.disabled = v;
    btn.textContent = v ? "Roasting…" : (freeUsed>=3 ? "🔥 NO FREE ROASTS" : `🔥 FREE ROAST (${3-freeUsed} left)`);
  }
}

function updateCounters(){
  const el = document.getElementById("statRoasts");
  if(el) el.textContent = totalRoasts.toLocaleString();
}

//// Paywall (mock)
const backdrop = document.getElementById("paywall");
function openPaywall(){ backdrop.style.display = "flex"; }
function closePaywall(){ backdrop.style.display = "none"; }
document.addEventListener("click", (e)=>{
  if(e.target.id === "paywall"){ closePaywall(); }
});

// Keyboard navigation like TikTok (up/down)
document.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowDown"){ feed.scrollBy({ top: window.innerHeight, behavior:"smooth" }); }
  if(e.key === "ArrowUp"){ feed.scrollBy({ top: -window.innerHeight, behavior:"smooth" }); }
});
