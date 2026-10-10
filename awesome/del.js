const { box, checkAdmin } = require('./_group_core');
module.exports = {
  name: "del",
  category: "Group",
  async execute(sock, msg, args, { from, sender }) {
    const key = msg.key;
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key } });
      const { isAdmin, isBotAdmin } = await checkAdmin(sock, from, sender);
      if (!isAdmin) {
        await sock.sendMessage(from, { react: { text: "⛔", key } });
        return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nOnly admins can delete messages") }, { quoted: msg });
      }
      if (!isBotAdmin) {
        await sock.sendMessage(from, { react: { text: "⛔", key } });
        return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot must be admin to delete") }, { quoted: msg });
      }
      const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
      const quotedId = ctx.stanzaId;
      const quotedParticipant = ctx.participant;

      if (!quotedId ||!quotedParticipant) {
        await sock.sendMessage(from, { react: { text: "❌", key } });
        return sock.sendMessage(from, { text: box("DEL Usage", ".del [reply to message]\nReply to the message you want to delete\n\nAlso:.delete") }, { quoted: msg });
      }

      const delKey = {
        remoteJid: from,
        fromMe: quotedParticipant.includes(sock.user.id.split(":")[0]) || quotedParticipant === sock.user.id,
        id: quotedId,
        participant: quotedParticipant
      };

      await sock.sendMessage(from, { delete: delKey });
      await sock.sendMessage(from, { react: { text: "✅", key } });
    } catch (e) {
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: box("FAILED", `❌ Failed to delete\n${e.message}\n\nBot must be admin & message not too old`) }, { quoted: msg });
    }
  }
};
