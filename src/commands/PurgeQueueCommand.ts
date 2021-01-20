import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";

export const purgequeue:ICommand =  {
    name: 'purgequeue',
    isAdmin: true,
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        
        if (SongQueueArrayInst[message.guild.id] === undefined || SongQueueArrayInst[message.guild.id].songs.length == 0) {
            await message.reply(`Queue is already empty`);
            return;
        }

        SongQueueArrayInst[message.guild.id].songs = [];
        
        message.reply(`Queue has been purged.`)        
    }
}