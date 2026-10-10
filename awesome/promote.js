const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "promote", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    if (!isBotAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot must be admin") }, { quoted: msg }); }
    let target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
    if (!target && args[0]) target = args[0].replace(/[^0-9]/g,"")+"@s.whatsapp.net";
    if (!target) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("Usage", ".promote @user") }, { quoted: msg }); }
    await sock.groupParticipantsUpdate(from, [target], "promote");
    await sock.sendMessage(from, { text: box("promote", `✅ Promoted @${target.split("@")[0]} to admin`), mentions: [target] }, { quoted: msg });

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
