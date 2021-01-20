import { Client, Message } from "discord.js";

export interface ICommandHandler {
    (err: unknown, client: Client, message: Message, oldMessage?: Message) : Promise<any>
}