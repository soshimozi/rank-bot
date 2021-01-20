
import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import yt = require('ytdl-core');
import {SongQueueArrayInst} from '../lib/music/SongQueueArray';
import { SongQueue } from "../lib/music/SongQueue";

export const addsong:ICommand = {
    name: 'addsong',
    description: 'Add a song to the music queue',
    exp: 50,
    handler: async (client:Client, message:Message, ... parameters:string[]):Promise<void> => {
        const url = parameters.length > 0 ? parameters[0] : '';

        if (!url || url === '') {
            await message.reply(`You must add a YouTube video url, or id after ${process.env.PREFIX}addsong`);
            return;
        } 
        
        if(!yt.validateURL(url)) {
            await message.reply(`Invalid YouTube Link: ${url}`);
            return;
        }


        let info:yt.videoInfo;
        try {
            info = await yt.getInfo(url);
        }
        catch(err) {
            await message.reply(`Failed to get information about YouTube link ${url}: ${err}`);
        }


        if (!SongQueueArrayInst[message.guild.id]) SongQueueArrayInst[message.guild.id] = new SongQueue();
        SongQueueArrayInst[message.guild.id].songs.push({url: url, title: info.videoDetails.title, requester: message.author.username, videoId: info.videoDetails.videoId, length: parseFloat(info.videoDetails.lengthSeconds)});
        await message.channel.send(`${message.author.username} just added **${info.videoDetails.title}** to the queue`);
    }
}


