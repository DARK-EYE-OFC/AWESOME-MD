module.exports = {
  name: "ping",
  aliases: ["speed", "p"],
  category: "GENERAL",
  async execute(sock, msg, args, { from }) {
    const key = msg.key;
    try {
      // ♻️ loading
      await sock.sendMessage(from, { react: { text: "♻️", key } });

      const start = Date.now();
      const pingMsg = await sock.sendMessage(from, { 
        text: "*_🏸 Pinging...._*" 
      }, { quoted: msg });

      // fake delay to feel real
      await new Promise(r => setTimeout(r, 600));

      const latency = Date.now() - start;

      // Edit to PONG
      await sock.sendMessage(from, {
        text: `*🏓 PONG!*\n*_Latency: ${latency} ms_*`,
        edit: pingMsg.key
      });

      // ✨ done
      await sock.sendMessage(from, { react: { text: "✨", key } });

    } catch (e) {
      console.log("Ping error:", e);
      await sock.sendMessage(from, { react: { text: "❌", key } });
      await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
    }
  }
};
