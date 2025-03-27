import { Card, CardOperation } from "@zora";
import { bold, inlineCode, italic, underline } from "discord.js";

export const formatOperations = (card: Card) =>
  card.ops.map((o) => formatOperation(o)).join("\n\n");

const formatOperation = (op: CardOperation) => {
  if (op.isExplicitNonOp) {
    return op.text.toUpperCase();
  }

  let sb = "";
  if (op.isAction) {
    sb += "[[action]] ";
  }
  if (op.isAttack) {
    sb += "ATTACK ";
  }
  sb += op.type.toUpperCase() + ": ";

  if (op.restriction) {
    const rxRestriction = new RegExp(/(res|inf|mil|col|tre)(\d+)/g).exec(
      op.restriction
    );
    if (rxRestriction) {
      const specialty = restrictionDict[rxRestriction[1]];
      const threshold = rxRestriction[2];
      sb += `^Requires <${specialty}> ${threshold}.^ `;
    }
  }

  sb += op.text;
  return replaceTextShortcuts(sb);
};

const restrictionDict: Record<string, string> = {
  res: "[[research]]",
  inf: "[[influence]]",
  mil: "[[military]]",
  col: "[[collective]]",
  tre: "[[treachery]]",
};

const shortcutDict = {
  "[[action]]": "<:action:1304075895694430250>",
  "[[away team]]": "<:awayteam:1304075894423289897>",
  "[[drone]]": "<:drone:1304075892946894878>",
  "[[glory]]": "<:glory:1304075924786122792>",
  "[[dilithium]]": "<:dilithium:1304075925905739856>",
  "[[latinum]]": "<:latinum:1304075923703726110>",
  "[[research]]": "<:research:1304075987620991090>",
  "[[influence]]": "<:influence:1304075963100958720>",
  "[[military]]": "<:military:1304075989302640700>",
};

const regexArray = [
  {
    pattern: /@(.+?)\/@/g,
    formatter: (_: any, t: any) => underline(t),
  },
  {
    pattern: /\$(.+?)\/\$/g,
    formatter: (_: any, t: any) => underline(t),
  },
  {
    pattern: /\*(.+?)\*/g,
    formatter: (_: any, t: any) => italic(t),
  },
  {
    pattern: /\^(.+?)\^/g,
    formatter: (_: any, t: any) => bold(t),
  },
  {
    pattern: /\[\[([\w-\?\' ]+)\]\]/g,
    formatter: (_: any, t: any) => inlineCode(t).toUpperCase(),
  },
];

const replaceTextShortcuts = (op: string) => {
  let result = op;
  for (const [k, v] of Object.entries(shortcutDict)) {
    result = result.replaceAll(k, v);
  }
  for (const re of regexArray) {
    result = result.replaceAll(re.pattern, re.formatter);
  }
  return result;
};
