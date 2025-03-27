import { Card } from "@zora";
import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export const getCardSelectComponent = (
  cards: Card[]
): ActionRowBuilder<StringSelectMenuBuilder> => {
  const select = new StringSelectMenuBuilder()
    .setCustomId("card-select")
    .setPlaceholder("Select a card")
    .addOptions(cards.map(getCardOption));
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
};

const getCardOption = (card: Card): StringSelectMenuOptionBuilder => {
  const name = card.details.name;
  const deck = card.set.deck !== "Commons" && card.set.deck;
  const box = card.set.box.startsWith("Promos") ? "Promos" : card.set.box;
  const suit = card.details.suit.toUpperCase();

  const description = deck
    ? `${suit} | ${deck}${card.details.position && ` - ${card.details.position}`}`
    : `${suit} | ${box}`;

  return new StringSelectMenuOptionBuilder()
    .setLabel(name)
    .setDescription(description)
    .setValue(card.id);
};
