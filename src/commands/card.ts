import { AppCommand } from "@zora";
import {
  MessageFlags,
  SlashCommandBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { getCardEmbed, getCardSelectComponent } from "../discord";

export const cardCommand: AppCommand = {
  data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Get info on a card in Captain's Chair!")
    .addStringOption((opt) =>
      opt
        .setName("search")
        .setDescription("Search for a card title")
        .setRequired(true)
    ),
  execute: async (interaction, services) => {
    const search = interaction.options.get("search")?.value;
    console.log("[CardCommand] Received search request for card:", search);
    if (!search || typeof search !== "string") {
      interaction.reply({
        content: "Sorry, but your search string looks to be empty...",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const restricted = interaction.guildId !== process.env.ADMIN_GUILD_ID;
    let results = services.cards.find(search, restricted);

    switch (results.length) {
      case 0:
        interaction.reply({
          content: "No such card found in the database!",
          flags: MessageFlags.Ephemeral,
        });
        break;
      case 1:
        const card = results[0];
        const embed = getCardEmbed(card);
        await interaction.reply({ embeds: [embed] });
        break;
      default:
        const select = getCardSelectComponent(results);
        const response = await interaction.reply({
          content: `Found ${results.length} cards with that name. Which did you want me to show you?`,
          components: [select],
          withResponse: true,
        });

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;

        try {
          const confirmation =
            (await response.resource?.message?.awaitMessageComponent({
              filter: collectorFilter,
              time: 60_000,
            })) as StringSelectMenuInteraction;
          if (confirmation) {
            const card = results.find((c) => c.id === confirmation.values[0])!;
            const embed = getCardEmbed(card);
            await interaction.editReply({
              content: null,
              components: [],
              embeds: [embed],
            });
          }
        } catch (error) {
          console.error("[CardCommand] Could not complete interaction", error);
          await interaction.editReply({
            content:
              "Sorry, something went oopsie. I'll have to run a systems analysis later...",
            components: [],
          });
        }
        break;
    }
  },
};
