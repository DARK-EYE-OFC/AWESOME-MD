require('./server');
require('./server');

const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const { startBot } = require('./main');

let QRCode;
try { QRCode = require('qrcode'); } catch(e) { console.log("Run: npm i qrcode"); }

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));

let sock = null;
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
    // Ubuntu/Chrome browser signature works best for pairing codes
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    generateHighQualityQRCode: true
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr && QRCode) {
      try {
        qrCode = await QRCode.toDataURL(qr);
      } catch (e) {
        console.error("QR Code generation error:", e);
      }
    }
    
    if (connection === 'open') {
      isConnected = true;
      qrCode = null;
      pairCode = null;
      console.log(`✅ ${config.botName} connected successfully!`);
      if (typeof startBot === 'function') {
        await startBot(sock);
      }
    } else if (connection === 'close') {
      isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.log(`Connection closed (StatusCode: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      
      if (shouldReconnect) {
        setTimeout(() => connectToWhatsApp(), 3000);
      } else {
        console.log("Logged out. Clear session folder to re-pair.");
      }
    }
  });
}

// WEB DASHBOARD
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AWESOME-MD Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; text-align: center; padding: 20px; }
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
            <button class="qr" type="submit">Refresh QR Code</button>
          </form>

          <form action="/pair" method="POST">
            <p>Click here to get Pair Code</p>
            <input type="text" name="number" placeholder="e.g. 26378XXXXXXX" required/>
            <button class="pair" type="submit">Get Pair Code</button>
          </form>
          ` : '<h2>Bot is Online</h2>'}
          
          ${qrCode && !isConnected ? `<h3>Scan this QR:</h3><img src="${qrCode}"/>` : ''}
          ${pairCode && !isConnected ? `<h3>Enter this code on WhatsApp:</h3><div class="code">${pairCode}</div>` : ''}
          
          <p style="margin-top:30px; opacity:0.5;">DARK-EYE OFC DEV</p>
        </div>
      </body>
    </html>
  `);
});

app.post('/qr', async (req, res) => {
  pairCode = null;
  if (!sock || !isConnected) {
    await connectToWhatsApp();
  }
  res.redirect('/');
});

app.post('/pair', async (req, res) => {
  const number = req.body.number.replace(/[^0-9]/g, '');
  
  if (!number) {
    return res.redirect('/');
  }

  try {
    if (!sock || isConnected) {
      await connectToWhatsApp();
    }
    
    // Give socket 1.5 seconds to ensure ws connection is active before requesting code
    setTimeout(async () => {
      try {
        if (sock && !sock.authState.creds.registered) {
          const code = await sock.requestPairingCode(number);
          pairCode = code?.match(/.{1,4}/g)?.join('-') || code;
          qrCode = null;
        }
      } catch (err) {
        console.error('Pairing Code Request Error:', err.message);
      }
    }, 1500);

  } catch (e) {
    console.error('Pair route error:', e.message);
  }
  
  // Wait brief moment for pairCode assignment before rendering dashboard
  setTimeout(() => res.redirect('/'), 2000);
});

console.log(`Starting ${config.botName}...`);
console.log(`
█████╗ ██╗    ██╗███████╗ ██████╗ ███╗   ███╗███████╗      ███╗   ███╗██████╗ 
██╔══██╗██║    ██║██╔════╝██╔═══██╗████╗ ████║██╔════╝      ████╗ ████║██╔══██╗
███████║██║ █╗ ██║█████╗  ██║   ██║██╔████╔██║█████╗        ██╔████╔██║██║  ██║
██╔══██║██║███╗██║██╔══╝  ██║   ██║██║╚██╔╝██║██╔══╝        ██║╚██╔╝██║██║  ██║
██║  ██║╚███╔███╔╝███████╗╚██████╔╝██║ ╚═╝ ██║███████╗█████╗██║ ╚═╝ ██║██████╔╝
╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚════╝╚═╝     ╚═╝╚══════╝ 
                                                        [THEON ALEX / DARK-EYE]
`);

connectToWhatsApp();
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));

