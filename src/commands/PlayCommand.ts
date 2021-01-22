import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/music/SongQueueArray";
import yt = require('ytdl-core');
import { ISongInfo } from "../interfaces/ISongInfo";
import { numPad, setDefaultBotStatus } from "../lib/Utils";

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

        async function playSong(song:ISongInfo, message:Message) {

            if (song === undefined) {
                await message.channel.send('Queue is empty');
                SongQueueArrayInst[message.guild.id].playing = false;
                message.member.voice.channel.leave();

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
    
            // get the dispatcher and set state for this song
            const dispatcher = message.guild.voice.connection.play(yt(song.url, { filter: "audioonly" }));
            SongQueueArrayInst[message.guild.id].dispatcher = dispatcher;
            SongQueueArrayInst[message.guild.id].playing = true;
            SongQueueArrayInst[message.guild.id].currentVideoLength = song.length;
            
            dispatcher.setVolume(SongQueueArrayInst[message.guild.id].volume / 10);

            // end any collection currently going on
            if(SongQueueArrayInst[message.guild.id].collector && !SongQueueArrayInst[message.guild.id].collector.ended) {
                SongQueueArrayInst[message.guild.id].collector.stop();
                SongQueueArrayInst[message.guild.id].collector = null;
            }

            // we only care about !skip messages
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
    
            let currentSong = song;

            dispatcher.once('finish', async() => {
                SongQueueArrayInst[message.guild.id].collector.stop();

                if(SongQueueArrayInst[message.guild.id].repeat) {
                    
                    await playSong(currentSong, message);
                    return;
                }

                let song = SongQueueArrayInst[message.guild.id].songs.shift();
                await playSong(song, message);

                dispatcher.destroy();
            });

            let description = `${"```"}md\nNow Playing\n---\n${song.title}`;

            if(song.playlistInfo) {
                description = `${description}\nplaylist: [${song.playlistInfo.title}]`;
            }

            //console.log(song.length);

            const minutes = Math.floor(song.length / 60);
            var seconds = song.length - minutes * 60;

            description += "```";
            
            let embed = {
                title: ' ',
                color: 0xcc0066,
                description,  
                timestamp: new Date(),
                // image: {
                //     url: `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`
                // },
                fields: [
                {
                    name: 'Length',
                    value: `${numPad(minutes, 2)}:${numPad(seconds, 2)}`,
                    inline: true
                },
                {
                    name: 'Requested By',
                    value: song.requester,
                    inline: true
                }
                ],
                footer: {
                    text: 'Brought to you by BitwiseMobile Productions [www.bitwisemobile.com] and, of course, Caffeine.  Inspired by the greatest son in the world, Daniel.',
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

        let song = SongQueueArrayInst[message.guild.id].songs.shift();
        await playSong(song, message);
    }
}