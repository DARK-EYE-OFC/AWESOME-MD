const fs = require('fs');
const { box, checkAdmin } = require('./_group_core');
module.exports = {
  name: "warn",
  category: "Group",
  async execute(sock, msg, args, { from, sender }) {
    const key = msg.key;
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key } });
      const { isAdmin, isBotAdmin } = await checkAdmin(sock, from, sender);
      if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only") }, { quoted: msg }); }
      if (!isBotAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Bot must be admin") }, { quoted: msg }); }

      // GET TARGET: mention > reply > number
      let target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
      // reply support
      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.participant;
      if (!target && quotedParticipant) target = quotedParticipant;
      // also check direct reply context
      const ctx = msg.message?.extendedTextMessage?.contextInfo || msg.message?.imageMessage?.contextInfo || msg.message?.videoMessage?.contextInfo || {};
      if (!target && ctx.participant) target = ctx.participant;
      if (!target && args[0] &&!isNaN(args[0].replace(/[^0-9]/g,""))) target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      if (!target) {
        await sock.sendMessage(from, { react: { text: "❌", key } });
        return sock.sendMessage(from, { text: box("warn Usage", ".warn @user reason\n.warn [reply to user] reason\nExample: reply to spammer and type.warn spamming") }, { quoted: msg });
      }

      const reason = args.join(" ").replace(/@\d+/g,"").trim() || msg.message?.extendedTextMessage?.text?.replace(/\.warn/g,"").replace(/@\d+/g,"").trim() || "No reason";
      // if first arg was number, remove it from reason
      let cleanReason = args.slice(1).join(" ");
      if (target === quotedParticipant) cleanReason = args.join(" ");
      if (!cleanReason) cleanReason = "No reason";

      const path = "./warns.json";
      let data = {}; try { if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path)); } catch { data = {}; }
      if (!data[from]) data[from] = {};
      if (!data[from][target]) data[from][target] = { count: 0, reasons: [] };
      data[from][target].count += 1;
      data[from][target].reasons.push({ reason: cleanReason, date: new Date().toISOString(), by: sender });
      const count = data[from][target].count;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));

      if (count >= 3) {
        await sock.sendMessage(from, { text: box("WARN LIMIT", `⚠️ @${target.split("@")[0]} reached 3/3 warns\n📝 Last: ${cleanReason}\nAction: Kicking`), mentions: [target] }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [target], "remove");
        delete data[from][target];
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        await sock.sendMessage(from, { react: { text: "⚠️", key } });
      } else {
        await sock.sendMessage(from, { text: box("WARNED", `⚠️ User: @${target.split("@")[0]}\n📊 Warn: ${count}/3\n📝 Reason: ${cleanReason}${count===2?"\n\n⚠️ Next warn = KICK":""}`), mentions: [target] }, { quoted: msg });
        await sock.sendMessage(from, { react: { text: "⚠️", key } });
      }
    } catch (e) {
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg });
    }
  }
};
