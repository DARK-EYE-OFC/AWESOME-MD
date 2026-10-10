const fs = require('fs');
const { box, checkAdmin } = require('./_group_core');
module.exports = {
  name: "delwarn",
  category: "Group",
  async execute(sock, msg, args, { from, sender }) {
    const key = msg.key;
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key } });
      const { isAdmin } = await checkAdmin(sock, from, sender);
      if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only") }, { quoted: msg }); }
      let target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
      const qp = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
      if (!target && qp) target = qp;
      if (!target && ctx.participant) target = ctx.participant;
      if (!target && args[0]) target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      if (!target) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("Usage", ".delwarn @user or reply to user") }, { quoted: msg }); }
      const path = "./warns.json";
      let data = {}; try { if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path)); } catch {}
      if (!data[from]?.[target] || data[from][target].count === 0) {
        await sock.sendMessage(from, { react: { text: "❌", key } });
        return sock.sendMessage(from, { text: box("DELWARN", `❌ @${target.split("@")[0]} has 0 warns`), mentions: [target] }, { quoted: msg });
      }
      data[from][target].count -= 1;
      data[from][target].reasons.pop();
      if (data[from][target].count <= 0) delete data[from][target];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      const left = data[from]?.[target]?.count || 0;
      await sock.sendMessage(from, { text: box("DELWARN", `✅ Removed 1 warn\n👤 @${target.split("@")[0]}\n📊 Now: ${left}/3`), mentions: [target] }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "⚠️", key } });
    } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg }); }
  }
};
