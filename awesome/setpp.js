const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "setpp", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    if (!isBotAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot admin needed") }, { quoted: msg }); }
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted?.imageMessage &&!msg.message?.imageMessage) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("Usage", ".setpp reply to image") }, { quoted: msg }); }
    try {
      const { downloadMediaMessage } = require("@whiskeysockets/baileys");
      let buffer = await downloadMediaMessage(msg, "buffer", {}, { logger: { level: "silent" }, reuploadRequest: sock.updateMediaMessage });
      if (!buffer) buffer = await sock.downloadMediaMessage(msg);
      await sock.updateProfilePicture(from, buffer);
      await sock.sendMessage(from, { text: box("setpp", "✅ Group picture updated") }, { quoted: msg });
    } catch(e) { throw e; }

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
