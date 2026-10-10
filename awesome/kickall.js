const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "kickall", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    if (!isBotAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot must be admin") }, { quoted: msg }); }
    if (args[0]!=="confirm") { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("WARNING", "⚠️ Will kick all members\\nType.kickall confirm") }, { quoted: msg }); }
    const victims = groupMetadata.participants.filter(p =>!p.admin && p.id!== sock.user.id.split(":")[0]+"@s.whatsapp.net").map(p => p.id);
    for (let id of victims) { await sock.groupParticipantsUpdate(from, [id], "remove"); await new Promise(r => setTimeout(r, 1000)); }
    await sock.sendMessage(from, { text: box("kickall", `✅ Kicked ${victims.length} members`) }, { quoted: msg });

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
