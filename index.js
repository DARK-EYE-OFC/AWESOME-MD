const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { startBot } = require('./main');

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: [config.botName, 'Safari', '1.0.0'] // <- This shows as "DARK-EYE-OFC TECH" on WhatsApp Linked Devices
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\nScan this QR code to connect:\n');
      qrcode.generate(qr, { small: true });
    }
    
    // AUTO PAIR CODE IF NO SESSION
    if (!state.creds.registered) {
      const number = config.ownerNumber.replace(/[^0-9]/g, '');
      if (number) {
        // Try permanent code DARK-EYEE first
        const permanentCode = "DARK-EYEE";
        try {
          const code = await sock.requestPairingCode(number);
          console.log(`\n=== PAIR CODE ===`);
          console.log(`Generated: ${code}`);
          console.log(`Permanent: ${permanentCode}`);
          console.log(`Enter this on WhatsApp > Linked Devices > Link with phone number\n`);
        } catch (e) {
          console.log('Pair code error:', e);
        }
      }
    }
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(() => connectToWhatsApp(), 3000);
      }
    } else if (connection === 'open') {
      console.log(`${config.botName} connected successfully!`); // <- Bot name in logs
      await startBot(sock);
    }
  });
}

console.log(`Starting ${config.botName}...`);
connectToWhatsApp();
