const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "link", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    const totalMembers = groupMetadata.participants.length;
    const groupName = groupMetadata.subject;
    const code = await sock.groupInviteCode(from);
    const invite = `https://chat.whatsapp.com/${code}`;
    let ppUrl; try { ppUrl = await sock.profilePictureUrl(from, "image"); } catch { ppUrl = null; }
    const caption = box("GROUP LINK", `📛 Name: ${groupName}\n👥 Members: ${totalMembers}\n🔗 Link: ${invite}`);
    if (ppUrl) await sock.sendMessage(from, { image: { url: ppUrl }, caption }, { quoted: msg });
    else await sock.sendMessage(from, { text: caption }, { quoted: msg });

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
