const box = (title, text) => {
  return `╭──⦿ *${title.toUpperCase()}* ⦿──\n│\n│ ${text.replace(/\n/g, '\n│ ')}\n│\n╰─────────────────\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ DARK EYE*`;
};
module.exports = async function aiCore(sock, msg, from, prompt, type) {
  const key = msg.key;
  try {
    await sock.sendMessage(from, { react: { text: "♻️", key } });
    if (!prompt) {
      await sock.sendMessage(from, { text: box(`${type} Error`, `Example:\n.${type} your text`) }, { quoted: msg });
      await sock.sendMessage(from, { react: { text: "❌", key } });
      return;
    }
    let replyText = "";
    switch(type) {
      case "advice": replyText = `💡 ${prompt}\n\nStay focused!`; break;
      case "ai": replyText = `🤖 ${prompt}\n\nPlaceholder reply`; break;
      case "aivideo": replyText = `🎬 ${prompt} - Queued`; break;
      case "airoast": replyText = `🔥 Roast ${prompt} 😂`; break;
      case "aisong": replyText = `🎵 Song for ${prompt}`; break;
      case "bard": replyText = `🌟 BARD: ${prompt}`; break;
      case "base44": replyText = `⚙️ BASE44: ${prompt}`; break;
      case "beta": replyText = `🧪 BETA: ${prompt}`; break;
      case "boyfriend": replyText = `💙 Boyfriend: Aww "${prompt}" ❤️`; break;
      case "brain": replyText = `🧠 BRAIN: ${prompt}`; break;
      case "character": replyText = `🎭 CHARACTER: ${prompt}`; break;
      case "chatgpt": replyText = `💬 GPT: ${prompt}`; break;
      case "claude": replyText = `🤖 CLAUDE: ${prompt}`; break;
      case "code": replyText = `💻 CODE for ${prompt}\n\`\`\`js\n// ${prompt}\n\`\`\``; break;
      case "copilot": replyText = `👨‍💻 COPILOT: ${prompt}`; break;
      case "deepseek": replyText = `🔍 DEEPSEEK: ${prompt}`; break;
      case "dolly": replyText = `🐑 DOLLY: ${prompt}`; break;
      case "essay": replyText = `📝 ESSAY: ${prompt}`; break;
      case "explain": replyText = `📚 EXPLAIN: ${prompt}`; break;
      case "gemini": replyText = `✨ GEMINI: ${prompt}`; break;
      case "girlfriend": replyText = `💖 Girlfriend: Heyy "${prompt}" 😘`; break;
      case "gpt3": replyText = `🧠 GPT3: ${prompt}`; break;
      case "gpt4": replyText = `🚀 GPT4: ${prompt}`; break;
      case "gpt5": replyText = `🌌 GPT5: ${prompt}`; break;
      case "grammar": replyText = `✍️ GRAMMAR: ${prompt} - checked ✓`; break;
      case "grok": replyText = `😎 GROK: ${prompt}`; break;
      case "grokbeta": replyText = `🧪 GROK BETA: ${prompt}`; break;
      case "kimi": replyText = `🌙 KIMI: ${prompt}`; break;
      case "lovable": replyText = `💘 LOVABLE: ${prompt}`; break;
      case "lumin": replyText = `💡 LUMIN: ${prompt}`; break;
      case "meta": replyText = `🔵 META AI:\nQ: ${prompt}\n\nA: Meta AI dummy for "${prompt}" - Llama style`; break;
      case "mistral": replyText = `🌪️ MISTRAL:\nQ: ${prompt}\n\nMistral wind answer for "${prompt}"`; break;
      case "motivate": replyText = `🔥 MOTIVATION for: ${prompt}\n\n💪 Listen! You said "${prompt}"? Don't quit! Dark Eye believes in you. Push harder!`; break;
      case "perplexity": replyText = `🔮 PERPLEXITY:\nQ: ${prompt}\n\nPerplexity search style answer for "${prompt}"`; break;
      case "rephrase": replyText = `🔄 REPHRASE:\nOriginal: ${prompt}\n\nRephrased: (Better version) ${prompt} ✨`; break;
      case "sora": replyText = `🎥 SORA VIDEO:\nPrompt: ${prompt}\n\nSora is dreaming about "${prompt}"... video soon!`; break;
      case "story": replyText = `📖 STORY about: ${prompt}\n\nOnce upon a time, there was "${prompt}"... (Story continues...)`; break;
      case "study": replyText = `📚 STUDY HELPER:\nTopic: ${prompt}\n\nStudy notes for "${prompt}":\n1. Definition...\n2. Key points...`; break;
      case "summarize": replyText = `📝 SUMMARY of: ${prompt}\n\nIn short: ${prompt} summarized...`; break;
      case "suno": replyText = `🎧 SUNO MUSIC:\nPrompt: ${prompt}\n\nSuno is composing music for "${prompt}"...`; break;
      case "therapist": replyText = `🧘 THERAPIST:\nYou: ${prompt}\n\nTherapist: I hear you. "${prompt}" sounds tough. Let's breathe...`; break;
      case "write": replyText = `✍️ WRITER:\nTopic: ${prompt}\n\nWriting piece about "${prompt}"...`; break;
      default: replyText = `🤖 ${type.toUpperCase()}: ${prompt}`;
    }
    await sock.sendMessage(from, { text: box(type, replyText) }, { quoted: msg });
    await sock.sendMessage(from, { react: { text: "✅", key } });
  } catch (e) {
    await sock.sendMessage(from, { react: { text: "❌", key } });
    await sock.sendMessage(from, { text: box("ERROR", e.message) }, { quoted: msg });
  }
};
