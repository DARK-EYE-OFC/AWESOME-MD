module.exports = (req, res) => {
  res.status(200).send(`
  <html>
  <head><title>AWESOME-MD</title></head>
  <body style="font-family:monospace;text-align:center;padding-top:50px;background:#000;color:#0f0">
  <h1>🤖 AWESOME-MD LIVE</h1>
  <p>Status: Online on Vercel</p>
  <p>Time: ${new Date().toISOString()}</p>
  <p><a href="https://github.com/DARK-EYE-OFC/AWESOME-MD" style="color:#0f0">GitHub</a></p>
  </body></html>
  `);
};
