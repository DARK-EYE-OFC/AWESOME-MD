const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "add", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    if (!isBotAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot must be admin") }, { quoted: msg }); }
    if (!args[0]) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("add Usage", ".add 2637xxxx") }, { quoted: msg }); }
    let num = args[0].replace(/[^0-9]/g,"")+"@s.whatsapp.net";
    await sock.groupParticipantsUpdate(from, [num], "add");
    await sock.sendMessage(from, { text: box("add", `✅ Added @${num.split("@")[0]}`), mentions: [num] }, { quoted: msg });

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
