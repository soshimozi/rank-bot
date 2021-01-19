import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/SongQueueArray";

export const pause:ICommand =  {
    name: 'pause',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].playing) {
            await message.channel.send(`You must be playing before you can use the command ${process.env.PREFIX}pause`);
            return;
        }
        
        SongQueueArrayInst[message.guild.id].dispatcher.pause(true);
        SongQueueArrayInst[message.guild.id].paused = true;

        message.reply(`Playback has been paused.  Resume with the ${process.env.PREFIX}resume command`)


    }
}