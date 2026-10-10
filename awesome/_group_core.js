const box = (title, text) => {
  return `╭──⦿ *${title.toUpperCase()}* ⦿──\n│\n│ ${text.replace(/\n/g, '\n│ ')}\n│\n╰─────────────────\n\n> *DARK EYE GROUP*`;
};

async function checkAdmin(sock, from, sender) {
  try {
    const meta = await sock.groupMetadata(from);
    const participants = meta.participants;

    const botNum = sock.user.id.split(":")[0].split("@")[0];
    const botLid = sock.user.lid? sock.user.lid.split("@")[0].split(":")[0] : "";

    // FIND BOT PARTICIPANT - handles @s.whatsapp.net and @lid
    let botParticipant = null;
    for (let p of participants) {
      const pid = p.id.split("@")[0].split(":")[0];
      if (p.id === sock.user.id || pid === botNum || (botLid && pid === botLid) || p.id.includes(botNum) || (botLid && p.id.includes(botLid))) {
        botParticipant = p;
        break;
      }
    }
    // fallback: if bot number not found, check if any participant id matches bot phone in any form
    if (!botParticipant) {
      botParticipant = participants.find(p => p.id.includes(botNum.slice(-8)));
    }

    const isBotAdmin = botParticipant?!!botParticipant.admin : false;

    // FIND SENDER - handles LID/PN
    const senderNum = sender.split("@")[0].split(":")[0];
    let senderParticipant = participants.find(p => p.id === sender);
    if (!senderParticipant) {
      senderParticipant = participants.find(p => {
        const pid = p.id.split("@")[0].split(":")[0];
        return pid === senderNum || p.id.includes(senderNum) || senderNum.includes(pid);
      });
    }

    let isAdmin = false;
    if (senderParticipant) {
      isAdmin =!!senderParticipant.admin;
    }
    // Owner is always admin
    if (meta.owner) {
      const ownerNum = meta.owner.split("@")[0].split(":")[0];
      if (senderNum === ownerNum || sender.includes(ownerNum)) isAdmin = true;
    }
    // If still not admin, check admin list directly
    if (!isAdmin) {
      const adminIds = participants.filter(p => p.admin).map(p => p.id.split("@")[0].split(":")[0]);
      isAdmin = adminIds.some(a => a === senderNum || senderNum.includes(a) || a.includes(senderNum.slice(-6)));
    }

    // DEBUG LOG
    console.log(`Admin Check: sender=${senderNum} isAdmin=${isAdmin} | bot=${botNum} isBotAdmin=${isBotAdmin} | participants=${participants.length}`);

    return { isAdmin, isBotAdmin, groupMetadata: meta };
  } catch (e) {
    console.log("Admin check error:", e.message, e.stack);
    // Don't block if error - allow to proceed
    return { isAdmin: true, isBotAdmin: true, groupMetadata: null };
  }
}

module.exports = { box, checkAdmin };
