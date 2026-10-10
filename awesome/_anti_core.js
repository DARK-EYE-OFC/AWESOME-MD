const fs = require('fs');
const { box, checkAdmin } = require('./_group_core');

module.exports = async function antiToggle(sock, msg, from, sender, args, type, pretty) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin } = await checkAdmin(sock, from, sender);
    if (!isAdmin) {
      await sock.sendMessage(from, { react: { text: "⛔", key } });
      await sock.sendMessage(from, { text: box("BLOCKED", `⛔ Admin only\n${pretty} requires admin`) }, { quoted: msg });
      return;
    }
    if (!isBotAdmin) {
      await sock.sendMessage(from, { react: { text: "⛔", key } });
      await sock.sendMessage(from, { text: box("BLOCKED", `⛔ Bot must be admin to delete`) }, { quoted: msg });
      return;
    }
    if (!args[0]) {
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: box(`${type} Usage`, `.${type} on - delete\n.${type} warn - warn + delete (3 warns=kick)\n.${type} off\n${pretty}`) }, { quoted: msg });
      return;
    }
    const path = `./${type}.json`;
    let data = {};
    try { if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path)); } catch { data = {}; }
    const mode = args[0].toLowerCase();
    if (mode === "on" || mode === "warn") {
      data[from] = mode; // store "on" or "warn"
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      if (mode === "warn") {
        await sock.sendMessage(from, { text: box(type.toUpperCase(), `⚠️ ${pretty} WARN MODE\nWill delete + warn user\n3 warns = kick`) }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: box(type.toUpperCase(), `✅ ${pretty} ENABLED\nWill auto-delete`) }, { quoted: msg });
      }
    } else if (mode === "off") {
      delete data[from];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      await sock.sendMessage(from, { text: box(type.toUpperCase(), `❌ ${pretty} DISABLED`) }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: box("Usage", `.${type} on / warn / off`) }, { quoted: msg });
      return;
    }
    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch (e) {
    await sock.sendMessage(from, { react: { text: "❌", key } });
    await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg });
  }
};
