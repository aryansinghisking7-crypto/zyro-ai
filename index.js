import 'dotenv/config';
import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';
import { askCommand } from './ask.js';
import { imageCommand } from './image.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Check if keys exist
console.log("GEMINI KEY LOADED:", !!process.env.GEMINI_KEY);
console.log("BOT TOKEN LOADED:", !!process.env.BOT_TOKEN);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Keep Render service awake
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ZYRO AI is alive');
}).listen(3000);

client.once('ready', async () => {
  console.log(`ZYRO AI is online as ${client.user.tag}`);
  
  const commands = [
    new SlashCommandBuilder()
      .setName('ask')
      .setDescription('Ask ZYRO AI anything')
      .addStringOption(option => 
        option.setName('question')
          .setDescription('Your question')
          .setRequired(true)),
          
    new SlashCommandBuilder()
      .setName('image')
      .setDescription('Generate AI image prompt')
      .addStringOption(option => 
        option.setName('prompt')
          .setDescription('Describe the image you want')
          .setRequired(true))
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  try {
    if (interaction.commandName === 'ask') {
      await askCommand(interaction, model);
    }
    if (interaction.commandName === 'image') {
      await imageCommand(interaction, model);
    }
  } catch (error) {
    console.error("COMMAND ERROR:", error);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply('❌ Something went wrong');
    } else {
      await interaction.reply({ content: '❌ Something went wrong', ephemeral: true });
    }
  }
});

client.login(process.env.BOT_TOKEN);
