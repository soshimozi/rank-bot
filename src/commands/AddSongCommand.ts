
import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import yt = require('ytdl-core');
import {SongQueueArrayInst} from '../lib/SongQueueArray';
import { SongQueue } from "../lib/SongQueue";
import { kMaxLength } from "buffer";

export const addsong:ICommand = {
    name: 'addsong',
    description: 'Add a song to the music queue',
    role: '',
    isAdmin: false,
    handler: async (client:Client, message:Message, ... parameters:string[]):Promise<void> => {
        const url = parameters.length > 0 ? parameters[0] : '';

        if (!url || url === '') {
            await message.channel.send(`You must add a YouTube video url, or id after ${process.env.PREFIX}addsong`);
            return;
        } 
        
        if(!yt.validateURL(url)) {
            await message.channel.send(`Invalid YouTube Link: ${url}`);
            return;
        }


        let info:yt.videoInfo;
        try {
            info = await yt.getInfo(url);
        }
        catch(err) {
            await message.channel.send(`Failed to get information about YouTube link ${url}: ${err}`);
        }

        if (!SongQueueArrayInst[message.guild.id]) SongQueueArrayInst[message.guild.id] = new SongQueue();
        SongQueueArrayInst[message.guild.id].songs.push({url: url, title: info.videoDetails.title, requester: message.author.username, videoId: info.videoDetails.videoId});
        await message.channel.send(`added **${info.videoDetails.title}** to the queue`);

        // let embed = {
        //     title: ' ',
        //     color: 0x2196f3,
        //     author: {
        //       name: `Added ${info.videoDetails.title} to the queue`,
        //       icon_url: `https://img.youtube.com/vi/${info.videoDetails.videoId}/hqdefault.jpg`
        //     },
        //     thumbnail: {
        //       url: `https://img.youtube.com/vi/${info.videoDetails.videoId}/hqdefault.jpg`
        //     },
        //     fields: [
        //       {
        //         name: 'Link',
        //         value: `[Click Here](https://www.youtube.com/watch?v=${info.videoDetails.videoId})`,
        //         inline: true
        //       },
        //       {
        //         name: 'Requested By',
        //         value: message.author.username,
        //         inline: true
        //       }
        //     ],
        //     footer: {
        //       text: 'HAL-9000 | The best bot for the best people.'
        //       }
        //   }
    
        //   if(SongQueueArrayInst[message.guild.id].songs.length > 0) {
        //     embed.fields.push({
        //       name: 'Up Next',
        //       value: SongQueueArrayInst[message.guild.id].songs[0].title,
        //       inline: false
        //     });
        //   }
    
        //   await message.channel.send({ embed });
    
        //   await client.user.setActivity(`Playing ${info.videoDetails.title}`);
        
    }
}


