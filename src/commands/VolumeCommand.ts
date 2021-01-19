import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/SongQueueArray";

export const volume:ICommand =  {
    name: 'volume',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if(parameters.length < 1) {
            await message.reply(`You must supply a value to the command in order to turn up or turn down the music.`);
            return;
        }

        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].playing || SongQueueArrayInst[message.guild.id].paused) {
            await message.channel.send(`You must be playing and not paused before you can use the command ${process.env.PREFIX}volume`);
            return;
        }

        const newVolume = parseFloat(parameters[0]);

        if(isNaN(newVolume) || newVolume < 0 || newVolume > 10) {
            await message.reply(`You must supply a value between 0 and 10 to set the volume`);
            return;
        }

        SongQueueArrayInst[message.guild.id].dispatcher.setVolume(newVolume / 10);
        SongQueueArrayInst[message.guild.id].volume = newVolume;

        await message.channel.send(`Volume was set to ${newVolume} by ${message.author.username}`);
       
    }
}