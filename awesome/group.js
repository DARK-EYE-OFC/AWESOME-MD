const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "group", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    if (!isBotAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot admin needed") }, { quoted: msg }); }
    if (!args[0]) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("Usage", ".group open / close") }, { quoted: msg }); }
    if (args[0]==="close") { await sock.groupSettingUpdate(from, "announcement"); await sock.sendMessage(from, { text: box("group", "🔒 Group closed - Admin only chat") }, { quoted: msg }); }
    else { await sock.groupSettingUpdate(from, "not_announcement"); await sock.sendMessage(from, { text: box("group", "🔓 Group opened - Everyone can chat") }, { quoted: msg }); }

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
