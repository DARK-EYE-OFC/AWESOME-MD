const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "ginfo", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const meta = await sock.groupMetadata(from);
    const groupId = meta.id;
    const groupName = meta.subject;
    const totalMembers = meta.participants.length;
    const totalAdmins = meta.participants.filter(p => p.admin).length;
    const creator = meta.owner? `@${meta.owner.split("@")[0]}` : "Unknown";
    const creationDate = meta.creation? new Date(meta.creation * 1000).toLocaleString() : "Unknown";
    const desc = meta.desc || "No description";
    let ppUrl; try { ppUrl = await sock.profilePictureUrl(from, 'image'); } catch { ppUrl = null; }
    const text = `╭──⦿ *GROUP INFO* ⦿──\n│\n│ 📛 *Name:* ${groupName}\n│ 🆔 *ID:* ${groupId}\n│ 👥 *Members:* ${totalMembers}\n│ 👑 *Admins:* ${totalAdmins}\n│ 👤 *Creator:* ${creator}\n│ 📅 *Created:* ${creationDate}\n│ 📝 *Desc:* ${desc.slice(0,300)}\n│\n╰─────────────────\n\n> *DARK EYE*`;
    if (ppUrl) await sock.sendMessage(from, { image: { url: ppUrl }, caption: text, mentions: meta.owner? [meta.owner] : [] }, { quoted: msg });
    else await sock.sendMessage(from, { text, mentions: meta.owner? [meta.owner] : [] }, { quoted: msg });
    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg }); }
}};
