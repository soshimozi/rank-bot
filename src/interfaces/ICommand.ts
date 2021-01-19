import {Client, Message} from "discord.js";

export interface ICommand {
    name: string;
    description?: string;
    helpText?:string;
    role?: string;
    isAdmin?: boolean;
    handler: (client: Client, message: Message, ...parameters: string[]) => Promise<void>
}