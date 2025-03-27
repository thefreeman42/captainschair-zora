import { ChatInputCommandInteraction, SharedSlashCommand } from "discord.js";
import { IAppContext } from "./IAppContext";

export type AppCommand = {
  data: SharedSlashCommand;
  execute: (
    interaction: ChatInputCommandInteraction,
    services: IAppContext
  ) => void | Promise<void>;
};
