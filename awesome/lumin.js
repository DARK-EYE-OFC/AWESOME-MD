const aiCore = require('./_ai_core');
module.exports = {
  name: "lumin",
  category: "AI",
  async execute(sock, msg, args, { from }) {
    const prompt = args.join(" ");
    await aiCore(sock, msg, from, prompt, "lumin");
  }
};
