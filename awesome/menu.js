const os = require('os');
const fs = require('fs');
const path = require('path');

function getDisplayMenu(pushName = "User") {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Africa/Harare' });
    const date = now.toLocaleDateString('en-ZW');
    const time = now.toLocaleTimeString('en-ZW', { timeZone: 'Africa/Harare' });

    const categories = {
        "AI": ["advice","ai","aivideo","airoast","aisong","bard","base44","beta","boyfriend","brain","character","chatgpt","claude","code","copilot","deepseek","dolly","essay","explain","gemini","girlfriend","gpt3","gpt4","gpt5","grammar","grok","grokbeta","kimi","lovable","lumin","meta","mistral","motivate","perplexity","rephrase","sora","story","study","summarize","suno","therapist","write"].sort(),
        "DOWNLOAD": ["apk","fb","insta","movie","play","series","song","tiktok","twitter","video","yt","ytmp3"].sort(),
        "ECONOMY": ["balance","beg","bet","buy","claim","daily","fish","gift","hunt","inventory","level","pay","rank","rob","sell","shop","slot","weekly","work","xp"].sort(),
        "FUN": ["8ball","compliment","cuddle","dare","emojigame","fact","flip","guessnum","hangman","howcute","howdumb","howgay","hug","joke","kill","kiss","meme","pat","pickup","quote","rate","riddle","roast","roll","ship","slap","tictactoe","trivia","truth","wouldyou"].sort(),
        "GENERAL": ["about","blocklist","donate","feedback","github","help","invite","language","menu","owner","ping","prefix","report","rules","runtime","speed","stats","status","suggest","version"].sort(),
        "GROUP": ["add","antibadword","antilink","ban","closegc","demote","demoteall","grouplink","groupinfo","hidetag","kick","kickall","leave","mute","opengc","promote","promoteall","revoke","setdesc","setname","setpp","tagall","unban","unmute","unwarn","warn","warnings","welcome"].sort(),
        "OTHER": ["afk","darkeye","mode","poll"].sort(),
        "OWNER": ["autojoin","autoleave","backup","banchat","block","broadcast","clearchat","eval","exec","join","leavegc","pair","restore","restart","setbio","setbotpic","setnamebot","setprefix","shutdown","unbanchat","unblock"].sort(),
        "RELIGION": ["bible","prayer","quran"].sort(),
        "SEARCH": ["google","img","news","pinterest","wallpaper"].sort(),
        "TOOLS": ["attp","blur","bright","circle","grayscale","invert","logo","picedit","quoteimg","removebg","s","sgif","simage","sticker","svid","toimg","togif","tomp3","tovideo","ttp"].sort(),
        "UTILS": ["calculator","currency","date","font","ip","lyrics","qr","readqr","shorturl","ssweb","time","timer","tovid","translate","weather"].sort()
    };

    let text = `╭┈⫷ *AWESOME-MD* ⫸⊶
┆✰╭──────────◆
┃✰│➣ *𝙾𝚆𝙽𝙴𝚁:* DARK EYE OFC
┃✰│➣ *𝚅𝙴𝚁𝚂𝙸𝙾𝙽:* 1.0.0
┃✰│➣ *𝙿𝚁𝙴𝙵𝙸𝚇:* [.]
┃✰│➣ *𝚃𝙾𝙳𝙰𝚈:* ${day}
┃✰│➣ *𝙳𝙰𝚃𝙴:* ${date}
┃✰│➣ *ᴛɪᴍᴇ*: ${time}
┃✰│➣ *𝚁𝚄𝙽𝚃𝙸𝙼𝙴:* ${Math.floor(os.uptime()/3600)}h
┃✰│➣ *𝙼𝙾𝙳𝙴:* 🌍 Public
┆✰╰────────────◆
╰┄┄┄┄┄┄┄┄◇\n\n`;

    Object.keys(categories).sort().forEach(cat => {
        const cmds = categories[cat];
        text += `╭┈⫷ *${cat}* ⫸\n`;
        text += `┆✰║\n`;
        text += `┃✰║ ❖ *\`[${cmds.length}]\`*\n`;
        cmds.forEach(c => {
            text += `┃✰║➣ *.${c}*\n`;
        });
        text += `┆✰╰━━━━━━━━━━━━••••\n`;
        text += `╰┄┄┄┄┄┄┄◇\n\n`;
    });

    text += `> *𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝑫𝑨𝑹𝑲 𝑬𝒀𝑬 𝑶𝑭𝑪*`;
    return text;
}

module.exports = {
  name: "menu",
  aliases: ["help", "allmenu", "commands"],
  category: "GENERAL",
  desc: "Show all commands",
  async execute(sock, msg, args, { from, sender }) {
    const pushName = msg.pushName || "User";
    const menuText = getDisplayMenu(pushName);

    // Try multiple image paths
    const possiblePaths = [
      "./media/awesome-md.jpg",
      path.join(__dirname, "../media/awesome-md.jpg")
    ];

    let imagePath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) { imagePath = p; break; }
    }

    try {
      if (imagePath) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: menuText
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: menuText }, { quoted: msg });
      }
    } catch (e) {
      console.log("Menu send error:", e.message);
      await sock.sendMessage(from, { text: menuText }, { quoted: msg });
    }
  }
};
