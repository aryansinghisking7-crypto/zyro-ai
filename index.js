import 'dotenv/config';
import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';

// Import commands from ROOT instead of /commands folder
import { askCommand } from './ask.js';
import { imageCommand } from './image.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

client.once('ready', () => {
  console.log(`ZYRO AI is online as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ask') {
    await askCommand(interaction, model);
  } 
  
  if (interaction.commandName === 'image') {
    await imageCommand(interaction, model);
  }
});

// Register slash commands on startup
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
    .setDescription('Generate AI image from text')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Describe the image')
        .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// KEEP ALIVE FOR RENDER 24/7
http.createServer((req,res)=>res.end('ZYRO alive')).listen(3000);
console.log('Web server running on port 3000');

client.login(process.env.BOT_TOKEN);
