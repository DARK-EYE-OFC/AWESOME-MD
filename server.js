const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
  <html>
  <head><title>AWESOME-MD</title>
  <meta http-equiv="refresh" content="30">
  <style>
    body{background:#0a0a0a;color:#00ff88;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column}
    .box{border:2px solid #00ff88;padding:30px;border-radius:15px;box-shadow:0 0 20px #00ff88}
    h1{margin:0 0 10px 0}
    .dot{display:inline-block;width:10px;height:10px;background:#00ff88;border-radius:50%;animation:blink 1s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  </style></head>
  <body>
    <div class="box">
      <h1><span class="dot"></span> AWESOME-MD LIVE</h1>
      <p>Status: Online</p>
      <p>Uptime: ${Math.floor(process.uptime()/60)} mins</p>
      <p>Time: ${new Date().toLocaleString()}</p>
      <p><a href="https://github.com/DARK-EYE-OFC/AWESOME-MD" style="color:#00ff88">GitHub</a></p>
    </div>
  </body></html>
  `);
});

app.get('/ping', (req, res) => res.json({ status: "alive", uptime: process.uptime() }));

app.listen(PORT, () => console.log(`🌐 Web Server running on ${PORT}`));

module.exports = app;
