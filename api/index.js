module.exports = (req, res) => {
res.setHeader('Content-Type','text/html');
res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AWESOME-MD | DARK-EYE</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'JetBrains Mono',monospace}
body{background:#000;color:#0f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.panel{width:100%;max-width:420px;border:2px solid #0f0;border-radius:20px;padding:30px;box-shadow:0 0 40px rgba(0,255,0,.4);background:rgba(0,255,0,.05)}
.logo{text-align:center;margin-bottom:25px}
.logo h1{font-size:28px;letter-spacing:2px}.logo p{opacity:.7;font-size:12px;margin-top:5px}
.status{display:flex;align-items:center;gap:10px;background:#000;padding:12px;border-radius:10px;border:1px solid #0f0;margin-bottom:20px}
.dot{width:10px;height:10px;background:#0f0;border-radius:50%;animation:blink 1s infinite;box-shadow:0 0 10px #0f0}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.btn{width:100%;padding:14px;background:#0f0;color:#000;border:none;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;margin-top:10px;transition:.2s}
.btn:hover{background:#000;color:#0f0;border:1px solid #0f0;box-shadow:0 0 15px #0f0}
.btn-outline{background:#000;color:#0f0;border:1px solid #0f0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px}
.card{border:1px solid #0f0;padding:15px;border-radius:10px;text-align:center;background:#000}
.card h3{font-size:20px}.card span{font-size:10px;opacity:.7}
.links{margin-top:20px;display:flex;gap:10px}
.links a{flex:1;text-align:center;padding:10px;border:1px solid #333;border-radius:8px;color:#888;text-decoration:none;font-size:12px}
.links a:hover{border-color:#0f0;color:#0f0}
</style>
</head>
<body>
<div class="panel">
<div class="logo"><h1>AWESOME-MD</h1><p>DARK-EYE OFFICIAL PANEL</p></div>

<div class="status"><div class="dot"></div> <span>SYSTEM ONLINE • Vercel Edge</span></div>

<div class="grid">
<div class="card"><h3>24/7</h3><span>UPTIME</span></div>
<div class="card"><h3>MD</h3><span>VERSION</span></div>
</div>

<button class="btn" onclick="window.open('https://wa.me/255XXXXXXXX?text=.menu','_blank')">OPEN BOT ON WHATSAPP</button>
<button class="btn btn-outline" onclick="window.open('https://github.com/DARK-EYE-OFC/AWESOME-MD','_blank')">GITHUB REPO</button>
<button class="btn btn-outline" onclick="window.open('https://awesome-md-ten.vercel.app','_blank')">STATUS API</button>

<div class="links">
<a href="https://github.com/DARK-EYE-OFC">GitHub</a>
<a href="https://wa.me/255XXXXXXXX">Support</a>
<a href="/ping">Ping</a>
</div>

<p style="text-align:center;margin-top:20px;font-size:10px;opacity:.5">© 2026 DARK-EYE-OFC • dark-eye-official.com</p>
</div>
</body>
</html>
`);
};
