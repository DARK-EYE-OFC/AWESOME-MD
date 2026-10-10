const { box, checkAdmin } = require('./_group_core');
module.exports = { name: "goodbye", category: "Group", async execute(sock, msg, args, { from, sender }) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    const { isAdmin, isBotAdmin, groupMetadata } = await checkAdmin(sock, from, sender);
    if (!isAdmin) { await sock.sendMessage(from, { react: { text: "⛔", key } }); return sock.sendMessage(from, { text: box("BLOCKED", "⛔ Admin only\nYou need to be group admin") }, { quoted: msg }); }
    
    const fs = require("fs");
    if (!args[0]) { await sock.sendMessage(from, { react: { text: "❌", key } }); return sock.sendMessage(from, { text: box("Usage", ".goodbye on / off") }, { quoted: msg }); }
    let data = {}; try { if (fs.existsSync("./goodbye.json")) data = JSON.parse(fs.readFileSync("./goodbye.json")); } catch {}
    if (args[0]==="on") { data[from]=true; fs.writeFileSync("./goodbye.json", JSON.stringify(data)); await sock.sendMessage(from, { text: box("goodbye", "✅ Goodbye enabled") }, { quoted: msg }); }
    else { delete data[from]; fs.writeFileSync("./goodbye.json", JSON.stringify(data)); await sock.sendMessage(from, { text: box("goodbye", "❌ Goodbye disabled") }, { quoted: msg }); }

    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch(e) { await sock.sendMessage(from, { react: { text: "❌", key } }); await sock.sendMessage(from, { text: box("FAILED", "❌ Failed: "+e.message) }, { quoted: msg }); }
}};
