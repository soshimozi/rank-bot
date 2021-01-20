import axios from "axios";
import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import yt = require('ytdl-core');
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";
import { SongQueue } from "../lib/music/SongQueue";
import ytpl = require('ytpl');

export const addplaylist:ICommand =  {
    name: 'addplaylist',
    usage: `${process.env.PREFIX}addplaylist {url or playlistid}`,
    exp: 400,
    handler: async (_client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if(parameters.length < 1) {
            await message.reply(addplaylist.usage)
            return;
        }

        let id:string;
        
        try {
            id = await ytpl.getPlaylistID(parameters[0]);
        }
        catch(err) {
            await message.reply(`Could not validate the playlist.  Please specify a valid playlist url or playlist id.`)
            return;
        }

        let count = await processPlaylist(id, message);

        message.reply(`You added a total of ${count} songs to the queue`);
    }
}

async function processPlaylist(id: string, message:Message): Promise<number> {
    let count:number = 0;
    let nextPageToken:string = '';

    do {

        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${process.env.YOUTUBEAPIKEY}&pageToken=${nextPageToken}`;

        let response = null;
        try {
            response = await axios.get(url);
        } 
        catch (exception) {
            console.error(`ERROR received from ${url}: ${exception}\n`);
            await message.reply('There was a problem with the id or token you supplied.  Please check these values and re-submit');
            break;
        }

        const data = response.data;

        if ('error' in data) {
            console.log('error', data.error)
            await message.reply( `An error has occurred: ${data.error.errors[0].message} - ${data.error.errors[0].reason}`);
            break;
        
        } else if (data.items.length === 0) {
        
            console.log('no videos')
            await message.reply('No videos found within playlist.');
            break;
        
        } else {
        
            for (let i = 0; i < data.items.length; i++) {
                let info:yt.videoInfo;

                const videoId = data.items[i].snippet.resourceId.videoId;
                const videoUrl:string = `https://www.youtube.com/watch?v=${videoId}`;
                
                try {
                    info = await yt.getInfo(videoUrl);
                }
                catch(err) {
                    await message.reply(`Failed to get information about YouTube link ${videoUrl}: ${err}`);
                    continue;
                }

                count++;
                if (!SongQueueArrayInst[message.guild.id]) SongQueueArrayInst[message.guild.id] = new SongQueue();
                SongQueueArrayInst[message.guild.id].songs.push({url: videoUrl, title: info.videoDetails.title, requester: message.author.username, videoId: info.videoDetails.videoId, length: parseFloat(info.videoDetails.lengthSeconds)});
                await message.channel.send(`${message.author.username} just added **${info.videoDetails.title}** to the queue via a playlist`);
            }
        
            nextPageToken = data.nextPageToken;
        }

    } while(nextPageToken && nextPageToken != '')

    return count;

}