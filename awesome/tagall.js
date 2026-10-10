const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "tagall", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    const participants = groupMetadata.participants.map(p => p.id);
    const text = args.join(" ") || "📢 Attention Everyone!";
    let tagText = box("tagall", `${text}\n\n` + participants.map((_,i) => `│ ${i+1}. @${participants[i].split("@")[0]}`).join("\n"));
    await sock.sendMessage(from, { text: tagText, mentions: participants }, { quoted: msg });

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
