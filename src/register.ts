import { REST, Routes } from "discord.js";
import "dotenv/config";
import commands from "./commands";

const commandData = Object.values(commands).map((c) => c.data);

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN!
);

const commandNames = commandData.map((c) => c.name);
console.log(
  "Refreshing application {/} commands. Available commands:",
  commandNames
);

rest
  .put(Routes.applicationCommands(process.env.DISCORD_APP_ID!), {
    body: commandData,
  })
  .then(() => console.log("Application {/} commands successfuly set."))
  .catch((err) => console.error(err));
