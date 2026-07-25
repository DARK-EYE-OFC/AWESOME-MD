const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode');
const express = require('express');
const config = require('./config');
const { startBot } = require('./main');

const app = express();
const PORT = process.env.PORT || 3000;

let sock;
let qrCode = null;
let pairCode = null;
let isConnected = false;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();
  
  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: [config.botName, 'Safari', '1.0.0'], // <- Shows as DARK-EYE-OFC TECH
    printQRInTerminal: false
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrCode = await qrcode.toDataURL(qr); // save QR as image for web
      pairCode = null;
      console.log('New QR generated. Go to / to scan');
    }
    
    if (connection === 'open') {
      isConnected = true;
      qrCode = null;
      pairCode = null;
      console.log(`${config.botName} connected successfully!`); // <- Bot name in logs
      await startBot(sock);
    } else if (connection === 'close') {
      isConnected = false;
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(() => connectToWhatsApp(), 5000);
      }
    }
  });
  
  // Request pair code function
  sock.requestPair = async () => {
    if (!state.creds.registered) {
      const number = config.ownerNumber.replace(/[^0-9]/g, '');
      if (number) {
        try {
          pairCode = await sock.requestPairingCode(number);
          qrCode = null;
          console.log(`Pair code: ${pairCode}`);
          return pairCode;
        } catch (e) {
          console.log('Pair code error:', e.message);
          return null;
        }
      }
    }
    return null;
  }
}

// WEB DASHBOARD
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>${config.botName} Dashboard</title>
      <style>
        body { font-family: Arial; background: #111; color: #fff; text-align: center; padding: 50px; }
        button { padding: 15px 30px; margin: 10px; font-size: 18px; border: none; border-radius: 10px; cursor: pointer; }
        .qr { background: #25D366; color: #fff; }
        .pair { background: #075E54; color: #fff; }
        img { margin-top: 20px; background: #fff; padding: 10px; border-radius: 10px; }
        .code { font-size: 32px; letter-spacing: 5px; margin: 20px; color: #25D366; }
      </style>
      </head>
      <body>
        <h1>${config.botName}</h1>
        <p>Status: ${isConnected ? '✅ Connected' : '❌ Not Connected'}</p>
        
        ${!isConnected ? `
        <button class="qr" onclick="window.location.href='/qr'">Get QR Code</button>
        <button class="pair" onclick="window.location.href='/pair'">Get Pair Code</button>
        ` : '<h2>Bot is Online</h2>'}
        
        ${qrCode ? `<h3>Scan this QR:</h3><img src="${qrCode}" width="300"/>` : ''}
        ${pairCode ? `<h3>Enter this code:</h3><div class="code">${pairCode}</div><p>WhatsApp > 3 dots > Linked Devices</p>` : ''}
        
        <p style="margin-top:50px; opacity:0.5;">Reminder: DARK-EYEE</p>
      </body>
    </html>
  `);
});

app.get('/qr', (req, res) => {
  if (!qrCode) res.redirect('/');
  else res.redirect('/');
});

app.get('/pair', async (req, res) => {
  if (sock && !isConnected) {
    await sock.requestPair();
  }
  res.redirect('/');
});

console.log(`Starting ${config.botName}...`);
connectToWhatsApp();
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));
