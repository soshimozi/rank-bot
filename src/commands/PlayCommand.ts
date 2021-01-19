import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { SongQueueArrayInst } from "../lib/SongQueueArray";
import yt = require('ytdl-core');
import { ISongInfo } from "../interfaces/ISongInfo";

export const play:ICommand = {
    name: 'play',
    description: 'Start playing current music queue',
    role: '',
    isAdmin: false,
    handler: async (client:Client, message:Message):Promise<void> => {
     
		if (SongQueueArrayInst[message.guild.id] === undefined) {
            await message.channel.send(`Add some songs to the queue first with ${process.env.PREFIX}addsong`);
            return;
        }

		if (!message.guild.voice) {

            await message.channel.send(`I must be added to a voice channel first.  Please us the ${process.env.PREFIX}join command.`);
            return;
        } 

		if (SongQueueArrayInst[message.guild.id].playing) {
            await message.channel.send('You are already playing.');
        } 
        
        let song = SongQueueArrayInst[message.guild.id].songs.shift();

        async function playSong(song:ISongInfo, message:Message) {

            console.log('song: ', song);
            
            if (song === undefined) {
                await message.channel.send('Queue is empty');
                SongQueueArrayInst[message.guild.id].playing = false;
                message.member.voice.channel.leave();

                // TODO: get a default activity string
                client.user.setActivity()
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
    
            dispatcher.on('finish', async() => {
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
                text: 'HAL-9000 | The best bot for the best people, unless your name is Dante then this bot was made explicitly to drive you crazy.'
                }
            }


  
            if(SongQueueArrayInst[message.guild.id].songs.length > 0) {
                embed.fields.push({
                  name: 'Up Next',
                  value: SongQueueArrayInst[message.guild.id].songs[0].title,
                  inline: false
                });
              }            

            await client.user.setActivity(song.title);
    
            await message.channel.send({embed});
        }

        await playSong(song, message);
    }
}