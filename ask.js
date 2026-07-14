import { SlashCommandBuilder } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const askCommand = {
  data: new SlashCommandBuilder()
   .setName('ask')
   .setDescription('Ask ZYRO AI anything')
   .addStringOption(option =>
      option.setName('question')
       .setDescription('Your question')
       .setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');

    if (question.includes('@everyone') || question.includes('@here')) {
      return interaction.reply({ content: '❌ I don\'t reply to mass pings', ephemeral: true });
    }

    await interaction.deferReply();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are ZYRO AI Bot for HUNTERZ. Be fun, smart, and helpful. Answer in 5-7 lines max. No essays. Question: ${question}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    await interaction.editReply(response);
  }
};
