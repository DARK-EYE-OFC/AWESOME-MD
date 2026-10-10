const { box, checkAdmin } = require('./_group_core');
module.exports = {
  name: "grouplink",
  category: "Group",
  aliases: ["glink","link","invite","linkgc","gclink"],
  async execute(sock, msg, args, { from, sender }) {
    const key = msg.key;
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key } });
      const { isAdmin, isBotAdmin } = await checkAdmin(sock, from, sender);
      if (!isAdmin) {
        await sock.sendMessage(from, { react: { text: "⛔", key } });
        return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nOnly admins can get group link") }, { quoted: msg });
      }
      if (!isBotAdmin) {
        await sock.sendMessage(from, { react: { text: "⛔", key } });
        return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot must be admin to get link") }, { quoted: msg });
      }
      const code = await sock.groupInviteCode(from);
      const link = `https://chat.whatsapp.com/${code}`;
      await sock.sendMessage(from, { text: box("GROUP LINK", `🔗 Link: ${link}\n\n📋 Code: ${code}\n\n⚠️ Don't share with strangers`) }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "✅", key } });
    } catch (e) {
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: box("FAILED", `❌ Failed to get link\n${e.message}`) }, { quoted: msg });
    }
  }
};
