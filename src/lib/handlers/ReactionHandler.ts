import { Client, Message, MessageReaction, User } from "discord.js";
import { IReactionHandler } from "../../interfaces/IReactionHandler";
import { LevelManager } from "../managers/LevelManager";
import { UserStatManager } from "../managers/UserStatManager";

export const ReactionHandler:IReactionHandler = async (err: unknown,
    client: Client,
    messageReaction: MessageReaction,
    user : User): Promise<void> => {
        
    if (err) {
        console.error(err);
        return;
    }

    if(!shouldHandleMessage(client, messageReaction.message)) {
        return;
    }

    await LevelManager.giveGuildUserExp(messageReaction.message.member, messageReaction.message);
    
    await UserStatManager.addUserReaction(messageReaction.message.author, messageReaction.message.guild, messageReaction.count || 1);
}


const shouldHandleMessage = (client: Client, message:Message):boolean => {

    // Ignore partial messages
    if(message.partial) return false;

    if(message.author.bot) return false;
    if(message.author.id === client.user.id) return false;

    // don't count DMs
    if(!message.guild) return false;

    return true;
};    