import { AppCommand } from "@zora";
import { cardCommand } from "./card";
import { zoraCommand } from "./zora";

const commandArrray = [cardCommand, zoraCommand];
const commands: Record<string, AppCommand> = commandArrray.reduce(
  (prev, curr) => ({ ...prev, [curr.data.name]: curr }),
  {}
);

export default commands;
