const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { startBot } = require('./main');

let pairRequested = false; // prevent spam

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: [config.botName, 'Safari', '1.0.0'], // <- This shows as "DARK-EYE-OFC TECH" on WhatsApp Linked Devices
    printQRInTerminal: false
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n=== SCAN QR TO CONNECT ===\n');
      qrcode.generate(qr, { small: true });
    }
    
    // AUTO PAIR CODE IF NO SESSION - ONLY ONCE + AFTER 3s DELAY
    if (!state.creds.registered && !pairRequested) {
      pairRequested = true;
      const number = config.ownerNumber?.replace(/[^0-9]/g, '');
      
      if (number) {
        setTimeout(async () => {
          try {
            const code = await sock.requestPairingCode(number);
            console.log(`\n=== PAIR CODE FOR ${config.botName} ===`);
            console.log(`Generated: ${code}`);
            console.log(`Reminder: DARK-EYEE`);
            console.log(`WhatsApp > 3 dots > Linked Devices > Link with phone number\n`);
          } catch (e) {
            console.log('Pair code failed. Use QR above instead.', e.message);
          }
        }, 3000);
      }
    }
    
    if (connection === 'close') {
      pairRequested = false; // reset for next reconnect
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(() => connectToWhatsApp(), 5000);
      }
    } else if (connection === 'open') {
      console.log(`${config.botName} connected successfully!`); // <- Bot name in logs
      await startBot(sock);
    }
  });
}

console.log(`Starting ${config.botName}...`);
connectToWhatsApp();
