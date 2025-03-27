import { Card } from "@zora";
import { EmbedBuilder } from "discord.js";
import { formatOperations } from "./operationFormatter";

export const getCardEmbed = (card: Card): EmbedBuilder => {
  const inline = true;
  const builder = new EmbedBuilder()
    .setColor(getSuitColor(card.details.suit))
    .setTitle(card.details.name)
    .addFields(
      { name: "Suit", value: toTitleCase(card.details.suit), inline },
      { name: "Deck", value: card.set.deck, inline }
    );

  // box / set / position
  if (card.set.deck === "Commons") {
    builder.addFields({ name: "Set", value: card.set.box, inline });
  } else if (card.details.position) {
    builder.addFields({
      name: "Starts in",
      value: toTitleCase(card.details.position),
      inline,
    });
  }

  // traits
  if (card.details.traits && card.details.traits.length > 0) {
    builder.addFields({
      name: "Traits",
      value: card.details.traits.map((t) => toTitleCase(t)).join(", "),
      inline,
    });
  }

  // skills / ATs / drones
  if (card.details.awayTeams) {
    builder.addFields({
      name: "Away Teams",
      value: card.details.awayTeams.toString(),
      inline,
    });
  } else if (card.details.drones) {
    builder.addFields({
      name: "Drones",
      value: card.details.drones.toString(),
      inline,
    });
  } else if (card.details.skills && card.details.skills.length > 0) {
    builder.addFields({
      name: "Skills",
      value: card.details.skills.map((t) => toTitleCase(t)).join(", "),
      inline,
    });
  }
  // score
  if (card.details.score) {
    builder.addFields({
      name: "Score",
      value: toTitleCase(card.details.score),
      inline,
    });
  }

  // ops
  builder.addFields({
    name: "Operations",
    value: formatOperations(card),
  });

  return builder;
};

const getSuitColor = (suit: string): number => {
  switch (suit) {
    case "captain":
      return 0xf0ffff;
    case "directive":
      return 0x64603a;
    case "location":
      return 0x00ff00;
    case "person":
      return 0xdaa520;
    case "cargo":
      return 0x004a8c;
    case "ship":
      return 0x808080;
    case "ally":
      return 0x800080;
    case "incident":
      return 0xff0000;
    case "encounter":
      return 0xdda0dd;
    case "qsuit":
      return 0xff1493;
    case "status":
      return 0x0d0d3f;
    default:
      // including mission
      return 0x000000;
  }
};

const toTitleCase = (val: string) => val.charAt(0).toUpperCase() + val.slice(1);
