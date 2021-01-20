import { Client, MessageReaction, User } from "discord.js";

export interface IReactionHandler {
    (err: unknown,
        client: Client,
        messageReaction: MessageReaction,
        user : User): Promise<void>    
}