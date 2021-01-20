import {Client, Message} from "discord.js";

export interface ICommand {
    name: string;
    description?: string;
    helpText?:string;
    usage?:string;
    role?: string;
    isAdmin?: boolean;
    exp?: number,
    handler: (client: Client, message: Message, ...parameters: string[]) => Promise<void>
}