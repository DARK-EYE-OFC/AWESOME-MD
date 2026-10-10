const { box, checkAdmin } = require('./_group_core');
module.exports = {
  name: "groupinfo",
  category: "Group",
  aliases: ["ginfo","gcinfo","infogc","groupi"],
  async execute(sock, msg, args, { from, sender }) {
    const key = msg.key;
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key } });
      const meta = await sock.groupMetadata(from);
      const participants = meta.participants;
      const admins = participants.filter(p => p.admin);
      const creationDate = new Date(meta.creation * 1000).toLocaleString();
      const owner = meta.owner? `@${meta.owner.split("@")[0]}` : "Unknown";
      const desc = meta.desc || "No description";
      const descOwner = meta.descOwner || "";
      const descTime = meta.descId? "Yes" : "No";
      
      // check restrict settings
      const announce = meta.announce? "Yes (admin only send)" : "No (all can send)";
      const restrict = meta.restrict? "Yes (admin only edit)" : "No";

      let txt = `📛 Name: ${meta.subject}\n`;
      txt += `🆔 ID: ${from}\n`;
      txt += `👑 Owner: ${owner}\n`;
      txt += `📅 Created: ${creationDate}\n`;
      txt += `👥 Members: ${participants.length}\n`;
      txt += `👮 Admins: ${admins.length}\n`;
      txt += `🔒 Admin only msg: ${announce}\n`;
      txt += `✏️ Admin only edit: ${restrict}\n`;
      txt += `📝 Has Desc: ${desc.length > 2? "Yes" : "No"}\n`;
      txt += `\n📜 Description:\n${desc.slice(0, 300)}\n`;
      txt += `\n👮 Admin List:\n`;
      admins.slice(0, 15).forEach((a,i)=>{
        txt += `│ ${i+1}. @${a.id.split("@")[0]} ${a.admin}\n`;
      });
      if (admins.length > 15) txt += `│ ...and ${admins.length-15} more\n`;

      await sock.sendMessage(from, { 
        text: box("GROUP INFO", txt),
        mentions: [...admins.map(a=>a.id), ...(meta.owner?[meta.owner]:[])]
      }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "✅", key } });
    } catch (e) {
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg });
    }
  }
};
