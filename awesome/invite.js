const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "invite", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    if (!args[0]) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("Usage", ".invite 2637xxxx") }, { quoted: msg }); }
    let num = args[0].replace(/[^0-9]/g,"")+"@s.whatsapp.net";
    const code = await sock.groupInviteCode(from);
    const invite = `https://chat.whatsapp.com/${code}`;
    await sock.sendMessage(num, { text: box("Group Invite", `🔗 Invited to join:\n${invite}`) });
    await sock.sendMessage(from, { text: box("invite", `✅ Invite sent to @${num.split("@")[0]}`), mentions: [num] }, { quoted: msg });

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
