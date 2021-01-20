import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const time:ICommand =  {
    name: 'time',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
    }
}
