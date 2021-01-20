import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";

export const time:ICommand =  {
    name: 'time',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].playing) {
            await message.reply(`You must be playing before you can use the command ${process.env.PREFIX}time`);
            return;
        }
        
        await message.reply(`Current stream time is ${SongQueueArrayInst[message.guild.id].dispatcher.streamTime}, total time is ${SongQueueArrayInst[message.guild.id].currentVideoLength}`);

    }
}
