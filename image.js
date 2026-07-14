import { SlashCommandBuilder } from 'discord.js';

export const imageCommand = {
  data: new SlashCommandBuilder()
   .setName('image')
   .setDescription('Generate image with AI')
   .addStringOption(option =>
      option.setName('prompt')
       .setDescription('What to generate')
       .setRequired(true)),

  async execute(interaction) {
    const prompt = interaction.options.getString('prompt');

    if (prompt.includes('@everyone') || prompt.includes('@here')) {
      return interaction.reply({ content: '❌ I don\'t reply to mass pings', ephemeral: true });
    }

    await interaction.deferReply();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024`;

    await interaction.editReply({
      content: `**Prompt:** ${prompt}`,
      files: [imageUrl]
    });
  }
};
