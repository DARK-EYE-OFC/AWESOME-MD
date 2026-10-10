const fs = require('fs');
const { box } = require('./_group_core');
module.exports = {
  name: "warnings",
  category: "Group",
  async execute(sock, msg, args, { from, sender }) {
    const key = msg.key;
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key } });
      let target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
      const qp = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const ctx = msg.message?.extendedTextMessage?.contextInfo || {};
      if (!target && qp) target = qp;
      if (!target && ctx.participant) target = ctx.participant;
      if (!target && args[0]) target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      if (!target) target = sender;
      const path = "./warns.json";
      let data = {}; try { if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path)); } catch {}
      const userWarns = data[from]?.[target];
      if (!userWarns) {
        await sock.sendMessage(from, { text: box("WARNINGS", `✅ @${target.split("@")[0]} is clean - 0/3 warns`), mentions: [target] }, { quoted: msg });
      } else {
        let txt = `👤 @${target.split("@")[0]}\n📊 Total: ${userWarns.count}/3\n\nReasons:\n`;
        userWarns.reasons.forEach((r,i)=>{ txt += `│ ${i+1}. ${r.reason} [${new Date(r.date).toLocaleDateString()}]\n`; });
        await sock.sendMessage(from, { text: box("WARNINGS", txt), mentions: [target] }, { quoted: msg });
      }
      await sock.sendMessage(from, { react: { text: "⚠️", key } });
    } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg }); }
  }
};
