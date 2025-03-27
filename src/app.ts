import { Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import commands from "./commands";
import { AppServices } from "./services";

const app = new AppServices();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName in commands) {
    const cmd = commands[interaction.commandName];
    await cmd.execute(interaction, app);
  } else {
    interaction.reply("Unknown command");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN!);
