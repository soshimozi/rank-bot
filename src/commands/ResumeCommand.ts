import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/SongQueueArray";

export const resume:ICommand =  {
    name: 'resume',
    role: '',
    isAdmin: false,
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].paused) {
            await message.reply(`You must be playing before you can use the command ${process.env.PREFIX}pause`);
            return;
        }

        SongQueueArrayInst[message.guild.id].dispatcher.resume();
        SongQueueArrayInst[message.guild.id].paused = false;

        message.channel.send(`Playback has been paused by ${message.author.username}.  Resume with the ${process.env.PREFIX}resume command`);
    }
}