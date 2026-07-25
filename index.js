const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const { startBot } = require('./main');

let QRCode;
try { QRCode = require('qrcode'); } catch(e) { console.log("Run: npm i qrcode") }

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));

let sock;
let qrCode = null;
let pairCode = null;
let isConnected = false;
let lastPhone = '';

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();
  
  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: [config.botName, 'Safari', '1.0.0'],
    printQRInTerminal: false
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr && QRCode) {
      qrCode = await QRCode.toDataURL(qr);
      pairCode = null;
    }
    
    if (connection === 'open') {
      isConnected = true;
      qrCode = null;
      pairCode = null;
      console.log(`${config.botName} connected successfully!`);
      await startBot(sock);
    } else if (connection === 'close') {
      isConnected = false;
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) setTimeout(() => connectToWhatsApp(), 5000);
    }
  });
}

// WEB DASHBOARD
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>AWESOME-MD Dashboard</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial; background: #0a0a0a; color: #fff; text-align: center; padding: 20px; }
        .container { max-width: 500px; margin: auto; background: #1a1a1a; padding: 30px; border-radius: 20px; }
        input { width: 90%; padding: 12px; margin: 10px 0; border-radius: 8px; border: none; background: #2a2a2a; color: #fff; font-size: 16px; text-align: center; }
        button { padding: 15px 30px; margin: 10px; font-size: 16px; border: none; border-radius: 10px; cursor: pointer; width: 90%; font-weight: bold; }
        .qr { background: #25D366; color: #000; }
        .pair { background: #128C7E; color: #fff; }
        img { margin-top: 20px; background: #fff; padding: 15px; border-radius: 10px; max-width: 280px; }
        .code { font-size: 32px; letter-spacing: 5px; margin: 20px; color: #25D366; font-weight: bold; }
        h1 { color: #25D366; }
      </style>
      </head>
      <body>
        <div class="container">
        <h1>AWESOME-MD</h1>
        <p>Status: ${isConnected ? '✅ Connected' : '❌ Not Connected'}</p>
        
        ${!isConnected ? `
        <form action="/qr" method="POST">
          <p>Click here to get QR code</p>
          <input type="text" name="number" placeholder="Enter your number: 26378XXXXXXX" required/>
          <button class="qr" type="submit">Get QR Code</button>
        </form>

        <form action="/pair" method="POST">
          <p>Click here to get Pair Code</p>
          <input type="text" name="number" placeholder="Enter your number: 26378XXXXXXX" required/>
          <button class="pair" type="submit">Get Pair Code</button>
        </form>
        ` : '<h2>Bot is Online</h2>'}
        
        ${qrCode ? `<h3>Scan this QR:</h3><img src="${qrCode}"/>` : ''}
        ${pairCode ? `<h3>Enter this code on WhatsApp:</h3><div class="code">${pairCode}</div>` : ''}
        
        <p style="margin-top:30px; opacity:0.5;">For you + your friends</p>
        </div>
      </body>
    </html>
  `);
});

app.post('/qr', async (req, res) => {
  lastPhone = req.body.number.replace(/[^0-9]/g, '');
  // QR auto generates on connection, so we just restart socket
  if(sock) await sock.ws.close();
  res.redirect('/');
});

app.post('/pair', async (req, res) => {
  const number = req.body.number.replace(/[^0-9]/g, '');
  lastPhone = number;
  if (sock && !isConnected) {
    try {
      pairCode = await sock.requestPairingCode(number);
      qrCode = null;
    } catch (e) {
      console.log('Pair error:', e.message);
    }
  }
  res.redirect('/');
});

console.log(`Starting ${config.botName}...`);
connectToWhatsApp();
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));
