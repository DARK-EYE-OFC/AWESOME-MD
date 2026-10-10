const antiToggle = require('./_anti_core');
module.exports = {
  name: "antisticker",
  category: "Group",
  async execute(sock, msg, args, { from, sender }) {
    const map = {
      antimedia: "Anti-Media", antisticker: "Anti-Sticker", antiaudio: "Anti-Audio",
      antivoice: "Anti-Voice", antiimage: "Anti-Image", antibot: "Anti-Bot",
      antitag: "Anti-Tag", antimention: "Anti-Mention", antivid: "Anti-Video",
      antiforward: "Anti-Forward", antilink: "Anti-Link"
    };
    await antiToggle(sock, msg, from, sender, args, "antisticker", map["antisticker"]);
  }
};
