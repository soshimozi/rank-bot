import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";
import yt = require('ytdl-core');
import { ISongInfo } from "../interfaces/ISongInfo";
import { setDefaultBotStatus } from "../lib/Utils";

export const play:ICommand = {
    name: 'play',
    description: 'Start playing current music queue',
    handler: async (client:Client, message:Message):Promise<void> => {
     
		if (SongQueueArrayInst[message.guild.id] === undefined) {
            await message.reply(`Add some songs to the queue first with ${process.env.PREFIX}addsong or ${process.env.PREFIX}addplaylist`);
            return;
        }

		if (!message.guild.voice || !message.guild.voice.connection) {

            await message.reply(`I must be added to a voice channel first.  Please use the ${process.env.PREFIX}join command.`);

            if(message.guild.voice.channel) {
                message.guild.voice.channel.leave();
            }

            return;
        } 

		if (SongQueueArrayInst[message.guild.id].playing) {
            await message.reply('You are already playing.');
            return;
        } 
        
        let song = SongQueueArrayInst[message.guild.id].songs.shift();

        async function playSong(song:ISongInfo, message:Message) {

            console.log('song: ', song);
            
            if (song === undefined) {
                await message.channel.send('Queue is empty');
                SongQueueArrayInst[message.guild.id].playing = false;
                message.member.voice.channel.leave();

                // TODO: get a default activity string
                //client.user.setActivity("HAL-9000 | You may call me Hal", {type: "CUSTOM_STATUS"});
                setDefaultBotStatus(client);
                return;
            }		
            
            if (!message.guild.voice || !message.guild.voice.connection) {

                await message.channel.send(`I must be added to a voice channel first.  Please use the ${process.env.PREFIX}join command.`);
    
                if(message.guild.voice.channel) {
                    message.guild.voice.channel.leave();
                }
    
                //client.user.setActivity("HAL-9000 | You may call me Hal", {type:"CUSTOM_STATUS"})
                setDefaultBotStatus(client);
                return;
            } 
    
            const dispatcher = message.guild.voice.connection.play(yt(song.url, { filter: "audioonly" }));
            SongQueueArrayInst[message.guild.id].dispatcher = dispatcher;
            SongQueueArrayInst[message.guild.id].playing = true;

            dispatcher.setVolume(SongQueueArrayInst[message.guild.id].volume / 10);

            if(SongQueueArrayInst[message.guild.id].collector && !SongQueueArrayInst[message.guild.id].collector.ended) {
                SongQueueArrayInst[message.guild.id].collector.stop();
                SongQueueArrayInst[message.guild.id].collector = null;
            }

            const messageFilter = response => {
                return response.content.toLowerCase() == `${process.env.PREFIX}skip`;
            };
            
            const collector = message.channel.createMessageCollector(messageFilter);
            SongQueueArrayInst[message.guild.id].collector = collector;
            
            collector.on('collect', async(m) => {
                if(m.content.toLowerCase() === `${process.env.PREFIX}skip`) {
                    
                    message.channel.send(`${message.author.username} just skipped to the next song.`);

                    let song = SongQueueArrayInst[message.guild.id].songs.shift();
                    await playSong(song, message);
                }
            });
    
            dispatcher.once('finish', async() => {
                SongQueueArrayInst[message.guild.id].collector.stop();

                let song = SongQueueArrayInst[message.guild.id].songs.shift();
                await playSong(song, message);
            });

            let embed = {
                title: ' ',
                color: 0x2196f3,
                author: {
                name: `Now Playing: ${song.title}`,
                icon_url: `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`
                },
                thumbnail: {
                url: `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`
                },
                fields: [
                {
                    name: 'Link',
                    value: `[Click Here](https://www.youtube.com/watch?v=${song.videoId})`,
                    inline: true
                },
                {
                    name: 'Requested By',
                    value: song.requester,
                    inline: true
                }
                ],
                footer: {
                text: 'Brought to you by BitwiseMobile Productions [www.bitwisemobile.com] and, of course, Caffeine.  Inspired by the greatest son in the world, Daniel.'
                }
            }
  
            if(SongQueueArrayInst[message.guild.id].songs.length > 0) {
                embed.fields.push({
                  name: 'Up Next',
                  value: SongQueueArrayInst[message.guild.id].songs[0].title,
                  inline: false
                });
              }            

            await client.user.setActivity(song.title, {type: "STREAMING"});
    
            await message.channel.send({embed});
        }

        await playSong(song, message);
    }
}