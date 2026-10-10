const fs = require('fs');
const path = require('path');
const config = require('./config');

// Store commands
const commands = new Map();

async function startBot(sock) {
  console.log(`${config.botName} is now running!`);
  loadCommands();

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    if (from === 'status@broadcast') return;

    const messageType = Object.keys(msg.message)[0];
    const text = messageType === 'conversation' ? msg.message.conversation : 
                 msg.message.extendedTextMessage?.text || 
                 msg.message[messageType]?.text || 
                 msg.message[messageType]?.caption || '';

    if (!text) return;

// ===== ANTI SYSTEM ENGINE WITH WARN =====
try {
  const fsAnti = require('fs');
  const antiGetMode = (file, chat) => {
    try {
      const p = `./awesome/${file}.json`;
      if (!fsAnti.existsSync(p)) return false;
      const d = JSON.parse(fsAnti.readFileSync(p));
      return d[chat] || false; // returns "on" or "warn" or false
    } catch { return false; }
  };
  const addWarn = (from, target, reason) => {
    try {
      const path = "./awesome/warns.json";
      let data = {}; if (fsAnti.existsSync(path)) data = JSON.parse(fsAnti.readFileSync(path));
      if (!data[from]) data[from] = {};
      if (!data[from][target]) data[from][target] = { count: 0, reasons: [] };
      data[from][target].count += 1;
      data[from][target].reasons.push({ reason, date: new Date().toISOString(), by: "ANTI" });
      const c = data[from][target].count;
      fsAnti.writeFileSync(path, JSON.stringify(data, null, 2));
      return c;
    } catch { return 0; }
  };

  const m = msg.message;
  const fwd = m?.extendedTextMessage?.contextInfo?.isForwarded || m?.imageMessage?.contextInfo?.isForwarded || m?.videoMessage?.contextInfo?.isForwarded || m?.stickerMessage?.contextInfo?.isForwarded || m?.audioMessage?.contextInfo?.isForwarded || false;
  const fwdScore = m?.extendedTextMessage?.contextInfo?.forwardingScore || 0;
  const reallyFwd = fwd || fwdScore > 0;

  const hasImage =!!m?.imageMessage;
  const hasVideo =!!m?.videoMessage;
  const hasSticker =!!m?.stickerMessage;
  const hasAudio =!!m?.audioMessage &&!m?.audioMessage?.ptt;
  const hasVoice =!!m?.audioMessage?.ptt;
  const hasMention = (m?.extendedTextMessage?.contextInfo?.mentionedJid?.length || 0) > 0;
  const hasManyMentions = (m?.extendedTextMessage?.contextInfo?.mentionedJid?.length || 0) > 4;
  const isBotMsg = msg.key?.id?.startsWith('BAE5') &&!msg.key.fromMe;

  if (from.endsWith('@g.us')) {
    const doAction = async (type, reason) => {
      const mode = antiGetMode(type, from);
      if (!mode) return false;
      await sock.sendMessage(from, { delete: msg.key });
      if (mode === "warn") {
        const count = addWarn(from, sender, reason);
        if (count >= 3) {
          await sock.sendMessage(from, { text: `╭──⦿ *${type.toUpperCase()}* ⦿──\n│\n│ ⚠️ @${sender.split("@")[0]} reached 3 warns for ${reason}\n│ Kicking...\n│\n╰─────────────────`, mentions: [sender] });
          await sock.groupParticipantsUpdate(from, [sender], "remove");
          // reset
          try {
            const p = "./awesome/warns.json"; let d = JSON.parse(fsAnti.readFileSync(p));
            delete d[from][sender]; fsAnti.writeFileSync(p, JSON.stringify(d, null, 2));
          } catch {}
        } else {
          await sock.sendMessage(from, { text: `╭──⦿ *WARN* ⦿──\n│\n│ ⚠️ @${sender.split("@")[0]} warned\n│ Reason: ${reason}\n│ Warn: ${count}/3\n│\n╰─────────────────`, mentions: [sender] });
        }
      }
      return true;
    };

    if (await doAction('antiforward', 'Forwarded message')) return;
    if (await doAction('antimedia', 'Media')) return;
    if (await doAction('antiimage', 'Image')) return;
    if (await doAction('antivid', 'Video')) return;
    if (await doAction('antiaudio', 'Audio')) return;
    if (await doAction('antivoice', 'Voice note')) return;
    if (await doAction('antisticker', 'Sticker')) return;
    if (await doAction('antimention', 'Mention')) return;
    if (await doAction('antitag', 'Mass tag')) return;
    if (await doAction('antibot', 'Bot message')) return;
    const modeLink = antiGetMode('antilink', from);
    if (modeLink) {
      const txt = m?.conversation || m?.extendedTextMessage?.text || m?.imageMessage?.caption || m?.videoMessage?.caption || "";
      if (txt.includes('https://') || txt.includes('http://') || txt.includes('chat.whatsapp.com') || txt.includes('wa.me')) {
        await doAction('antilink', 'Link');
        return;
      }
    }
  }
} catch (e) { console.log('Anti error:', e.message); }
// ===== END ANTI ENGINE =====
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? msg.key.participant : from;

    if (config.autoRead) await sock.readMessages([msg.key]);
    if (config.autoTyping) await sock.sendPresenceUpdate('composing', from);

    // Check prefix
    if (!text.startsWith(config.prefix)) return;

    const args = text.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    try {
      await handleCommand(sock, msg, commandName, args, from, sender, isGroup, text);
    } catch (error) {
      console.error('Error handling command:', error);
      await sock.sendMessage(from, { text: `❌ Error: ${error.message}` });
    }
  });
}

function loadCommands() {
  const awesomePath = path.join(__dirname, 'awesome');
  
  if (!fs.existsSync(awesomePath)) {
    fs.mkdirSync(awesomePath, { recursive: true });
    console.log('Created awesome/ folder');
    return;
  }

  const files = fs.readdirSync(awesomePath).filter(f => f.endsWith('.js'));
  console.log(`Loading ${files.length} commands from awesome/ folder...`);

  for (const file of files) {
    try {
      const filePath = path.join(awesomePath, file);
      delete require.cache[require.resolve(filePath)]; // hot reload
      const cmd = require(filePath);
      
      const name = file.replace('.js', '').toLowerCase(); // filename = command name
      
      // Support exports with name property
      const cmdName = cmd.name || name;
      
      commands.set(cmdName, cmd);
      
      // Support aliases
      if (cmd.aliases && Array.isArray(cmd.aliases)) {
        cmd.aliases.forEach(alias => commands.set(alias, cmd));
      }
      
      console.log(`✅ Loaded: ${cmdName}`);
    } catch (e) {
      console.log(`❌ Failed to load ${file}:`, e.message);
    }
  }
}

async function handleCommand(sock, msg, command, args, from, sender, isGroup, text) {
  // 1. Check if command exists in awesome/ folder
  if (commands.has(command)) {
    const cmd = commands.get(command);
    
    // Commands can be function or object with execute
    if (typeof cmd === 'function') {
      return await cmd(sock, msg, args, { from, sender, isGroup, text, commands, config });
    } else if (cmd.execute) {
      return await cmd.execute(sock, msg, args, { from, sender, isGroup, text, commands, config });
    }
  }

  // 2. Fallback for old commands
  switch (command) {
    case 'ping':
      const ping = commands.get('ping');
      if (ping) return ping.execute ? ping.execute(sock, msg, args, { from }) : ping(sock, msg, args, { from });
      await sock.sendMessage(from, { text: 'Pong! 🏓' });
      break;
      
    default:
      // Optional: unknown command
      // await sock.sendMessage(from, { text: `❌ Unknown command: .${command}\nType .menu to see all` });
      break;
  }
}

module.exports = { startBot, commands, loadCommands };
