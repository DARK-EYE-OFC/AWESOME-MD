const { box, checkAdmin } = require('./_group_core');
module.exports = {
  name: "checkadmin",
  category: "Group",
  async execute(sock, msg, args, { from, sender }) {
    try {
      const meta = await sock.groupMetadata(from);
      const botNum = sock.user.id.split("@")[0];
      const botLid = sock.user.lid || "no LID";
      let txt = `Bot ID: ${botNum}\nBot LID: ${botLid}\nSender: ${sender}\nOwner: ${meta.owner}\n\nParticipants:\n`;
      meta.participants.forEach(p => {
        txt += `│ ${p.id} ${p.admin? '- ADMIN '+p.admin : ''}\n`;
      });
      const { isAdmin, isBotAdmin } = await checkAdmin(sock, from, sender);
      txt += `\n│\n│ Result: you isAdmin=${isAdmin} | bot isBotAdmin=${isBotAdmin}`;
      await sock.sendMessage(from, { text: box("CHECK ADMIN", txt) }, { quoted: msg });
    } catch(e) {
      await sock.sendMessage(from, { text: box("FAILED", e.message) }, { quoted: msg });
    }
  }
};
