import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";
import { numPad } from "../lib/Utils";

export const time:ICommand =  {
    name: 'time',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].playing) {
            await message.reply(`You must be playing before you can use the command ${process.env.PREFIX}time`);
            return;
        }
        
        const totalLength = SongQueueArrayInst[message.guild.id].currentVideoLength;

        const totalMinutes = Math.floor(totalLength / 60);
        const totalSeconds = Math.floor(totalLength - totalMinutes * 60);

        const currentLength = SongQueueArrayInst[message.guild.id].dispatcher.streamTime / 1000;
        const currentMinutes = Math.floor(currentLength / 60);
        const currentSeconds = Math.floor(currentLength - currentMinutes * 60);


        await message.reply(`Current stream time is ${numPad(currentMinutes, 2)}:${numPad(currentSeconds, 2)}, total time is ${numPad(totalMinutes, 2)}:${numPad(totalSeconds, 2)}`);

    }
}
