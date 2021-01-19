import { Client, Message, StreamDispatcher } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueue } from "../lib/SongQueue";
//import MusicBot from "../lib/MusicBot";
import yt = require('ytdl-core');
import {SongQueueArrayInst} from '../lib/SongQueueArray';

export const testyoutube: ICommand = {
    name: 'testyoutube',
    description: 'Test Youtube',
    isAdmin: true,
    handler: async (client:Client, message:Message, ...parameters: string[]):Promise<void> => {
        const url = parameters[0];

        if (SongQueueArrayInst[message.guild.id] && SongQueueArrayInst[message.guild.id].playing) {
            await message.channel.send('Already Playing');
        }

        if(SongQueueArrayInst[message.guild.id]) {
            console.log('song count: ', SongQueueArrayInst[message.guild.id].songs.length);
        }

        if (url == '' || url === undefined) {
            await message.channel.send(`You must add a YouTube video url, or id after ${process.env.PREFIX}add`);
            return;
        } 
        
        if(!yt.validateURL(url)) {
            await message.channel.send(`Invalid YouTube Link: ${url}`);
            return;
        }

        try {

            const info = await yt.getInfo(url);

			// SongQueueArrayInst[message.guild.id].songs.push({url: url, title: info.videoDetails.title, requester: message.author.username});
            // await message.channel.send(`added **${info.videoDetails.title}** to the queue`);
            
            // if (this.songQueue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${process.env.PREFIX}add`);
            if (!message.guild.voice.connection) {
                await message.channel.send(`I must be added to a voice channel first.  Please us the ${process.env.PREFIX}join command.`);
                return;
            }

            if (!SongQueueArrayInst[message.guild.id]) SongQueueArrayInst[message.guild.id] = new SongQueue();
            SongQueueArrayInst[message.guild.id].dispatcher = message.guild.voice.connection.play(yt(url, { filter: "audioonly" }));
            SongQueueArrayInst[message.guild.id].playing = true;

        }
        catch(err) {
            await message.channel.send(`Invalid YouTube Link: ${err}`);    
        }
    }
}
