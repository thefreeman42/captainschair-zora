import { AppCommand } from "@zora";
import { SlashCommandBuilder } from "discord.js";

export const zoraCommand: AppCommand = {
  data: new SlashCommandBuilder()
    .setName("zora")
    .setDescription("Let Zora introduce themselves!"),
  execute: async (interaction) => {
    await interaction.reply("Hi there! I am Zora, the ship's computer.");
  },
};
