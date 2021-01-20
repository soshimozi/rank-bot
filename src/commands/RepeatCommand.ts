import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";

export const repeat:ICommand = {
    name: 'repeat',
    description: 'Repeat the current song until skippped',
    handler: async (client:Client, message:Message):Promise<void> => {

        if (SongQueueArrayInst[message.guild.id] === undefined || !SongQueueArrayInst[message.guild.id].playing) {
            await message.reply(`You must be playing before you can use the command ${process.env.PREFIX}repeat`);
            return;
        }
        
        //SongQueueArrayInst[message.guild.id].dispatcher.pause(true);
        SongQueueArrayInst[message.guild.id].repeat = true;

        message.channel.send(`The current song has been put on repeat by ${message.author.username} until skipped.`);
    }
}
