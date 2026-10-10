module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
  <!DOCTYPE html>
  <html><head><title>AWESOME-MD</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{background:#000;color:#0f0;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;flex-direction:column;text-align:center}
    .box{border:2px solid #0f0;padding:40px;border-radius:20px;box-shadow:0 0 30px #0f0}
    h1{font-size:32px} a{color:#0f0;text-decoration:none;border:1px solid #0f0;padding:10px 20px;border-radius:10px;display:inline-block;margin-top:15px}
    .dot{width:12px;height:12px;background:#0f0;border-radius:50%;display:inline-block;animation:blink 1s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
  </style></head>
  <body>
    <div class="box">
      <h1><span class="dot"></span> AWESOME-MD</h1>
      <p>✅ Bot is Live</p>
      <p>Deploy on Koyeb for 24/7</p>
      <p>Uptime: ${new Date().toLocaleString()}</p>
      <a href="https://github.com/DARK-EYE-OFC/AWESOME-MD">GitHub Repo</a>
    </div>
  </body></html>
  `);
};
