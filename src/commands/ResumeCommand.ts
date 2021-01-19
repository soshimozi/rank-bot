import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/SongQueueArray";

export const resume:ICommand =  {
    name: 'resume',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].paused) {
            await message.reply(`You must be paused before you can use the command ${process.env.PREFIX}resume`);
            return;
        }

        SongQueueArrayInst[message.guild.id].dispatcher.resume();
        SongQueueArrayInst[message.guild.id].paused = false;

        message.channel.send(`Playback was resumed by ${message.author.username}.`);
    }
}