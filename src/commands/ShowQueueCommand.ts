import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/SongQueueArray";

export const showqueue:ICommand =  {
    name: 'showqueue',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if (SongQueueArrayInst[message.guild.id] === undefined || SongQueueArrayInst[message.guild.id].songs.length === 0) {
            await message.reply(`Add some songs to the queue first with ${process.env.PREFIX}addsong`);
            return;
        }

        let response = '```'
        const isQueueLong = SongQueueArrayInst[message.guild.id].songs.length > 30
        for (let i = 0; i < (isQueueLong ? 30 : SongQueueArrayInst[message.guild.id].songs.length); i++) {
          response +=
            `"${SongQueueArrayInst[message.guild.id].songs[i].title}" (requested by ${SongQueueArrayInst[message.guild.id].songs[i].requester})\n`;
        }
    
        if (isQueueLong) {
          response += `\n**...and ${(SongQueueArrayInst[message.guild.id].songs.length - 30)} more.**`;
        }
    
        response += '```'

        await message.reply(response);
    }
}
