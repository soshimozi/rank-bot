import yt = require('ytdl-core');
import { Client, Message } from 'discord.js';
import MusicBotState from './MusicBotState';
const request = require('request');

class MusicBot {
    public youtubeSearchOptions: any;
    public bot:Client;
    constructor () {
      this.youtubeSearchOptions = null
      this.bot = null;
    }

    async queuePlaylist(id:string, message:Message, token:string = '') : Promise<void>{

        let playListResponse = await this._getPlaylist(id, token);
        const json = JSON.parse(playListResponse);

        if ('error' in json) {
            console.log('error')
        
            await message.reply( `An error has occurred: ${json.error.errors[0].message} - ${json.error.errors[0].reason}`);
        
        } else if (json.items.length === 0) {
        
            console.log('no videos')
            await message.reply('No videos found within playlist.');
        
        } else {
        
            for (let i = 0; i < json.items.length; i++) {
                //console.log('queue item', json.items[i]);
                await this.addToQueue(json.items[i].snippet.resourceId.videoId, message, true);
            }
        
            if (json.nextPageToken === null) {
                return;
            }
        
            this.queuePlaylist(id, message, json.nextPageToken)
        }
       
    }

    private async _getPlaylist(id:string, token:string) : Promise<any> {

        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${process.env.YOUTUBEAPIKEY}&pageToken=${token}`;
        return new Promise((resolve, reject) => {
            request(url, (err, response, body) => {
                if(err) { return reject(err); }

                resolve(body);
            });
        });
    }

    async addToQueue(video:string, message:Message, mute:boolean = false): Promise<void> {

        console.log('adding video :', video);
        let videoId = this.getVideoId(video);
        console.log('video id: ', videoId);

        try {
            var info = await yt.getInfo(`https://www.youtube.com/watch?v=${videoId}`);

            //console.log('video info:', info);

            MusicBotState.queue.push({ title: info.videoDetails.title, id: videoId, user: message.author.username, channelId: message.channel.id})
            
            if (!mute) {
                await message.reply(`"${info.videoDetails.title}" has been added to the queue.`);
            }

            if (!MusicBotState.stopped && !MusicBotState.isPlaying() && MusicBotState.queue.length > 0) {
                console.log('play next song')
                this.playNextSong()
            } else if(!MusicBotState.stopped && MusicBotState.isPlaying() && MusicBotState.queue.length === 1) {
                let embed = {
                    title: ' ',
                    color: 0x2196f3,
                    author: {
                    name: 'Up next: ' + MusicBotState.queue[0].title,
                    icon_url: 'https://img.youtube.com/vi/' + MusicBotState.queue[0].id + '/hqdefault.jpg'
                    },
                    thumbnail: {
                    url: 'https://img.youtube.com/vi/' + MusicBotState.queue[0].id + '/hqdefault.jpg'
                    },
                    fields: [
                    {
                        name: 'Link',
                        value: '[Click Here](' + 'https://www.youtube.com/watch?v=' + MusicBotState.queue[0].id + ')',
                        inline: true
                    },
                    {
                        name: 'Requested By',
                        value: MusicBotState.queue[0].user,
                        inline: true
                    }
                    ],
                    footer: {
                    text: 'HAL-9000 | The best bot for the best people.'
                    }
                }

                await message.channel.send({embed});
            }
  
        }
        catch(error) {
            await message.reply(`The requested video (${videoId}) does not exist or cannot be played.`);
            console.log(`Error (${videoId}): ${error}`);

        }

      }

    

    // private async _getYouTubeVideo(videoId: string):Promise<any> {

    //     return new Promise((resolve, reject) => {
    //         console.log('about to get video ', videoId);

    //         ytdl.getInfo('https://www.youtube.com/watch?v=' + videoId, (error, info) => {

    //             if(error) {
    //                 console.error('error: ', error);
    //                 return reject(error);
    //             }

    //             console.log('video info: ', info);
    //             resolve(info);
    //         });
    //     });
    // }      

    async playNextSong() {
        
        if (MusicBotState.isQueueEmpty()) {
          return; // await MusicBotState.textChannel.sendMessage('The queue is empty!');
        }
  
        MusicBotState.stopped = false
        if (!MusicBotState.voiceConnection) {
            
            try {
                let connection = await MusicBotState.voiceChannel.join();
                MusicBotState.voiceConnection = connection;
            }
            catch(err) {
                console.error(err);
            }
        }
  
        const videoId = MusicBotState.queue[0].id
        const title = MusicBotState.queue[0].title
        const user = MusicBotState.queue[0].user
  
        MusicBotState.nowPlaying = MusicBotState.queue[0]
  
        let embed = {
          title: ' ',
          color: 0x2196f3,
          author: {
            name: 'Now playing: ' + title,
            icon_url: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
          },
          thumbnail: {
            url: 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg'
          },
          fields: [
            {
              name: 'Link',
              value: '[Click Here](' + 'https://www.youtube.com/watch?v=' + videoId + ')',
              inline: true
            },
            {
              name: 'Requested By',
              value: user,
              inline: true
            }
          ],
          footer: {
            text: 'HAL-9000 | The best bot for the best people.'
            }
        }
  
        if(MusicBotState.queue.length > 1) {
          embed.fields.push({
            name: 'Up Next',
            value: MusicBotState.queue[1].title,
            inline: false
          });
        }
  
        await MusicBotState.textChannel.send({ embed });
  
        this.bot.user.setActivity(title)
  
        const audioStream = yt('https://www.youtube.com/watch?v=' + videoId)
        MusicBotState.voiceHandler = MusicBotState.voiceConnection.playStream(audioStream)
        MusicBotState.queue.shift()
  
        MusicBotState.voiceHandler.once('end', () => {
          setTimeout(() => {
            MusicBotState.voiceHandler = null
            
            this.bot.user.setActivity('HAL-9000 | The best bot for the best people.');

            if (!MusicBotState.isPlaying() && !MusicBotState.stopped && MusicBotState.queue.length > 0) {
              this.playNextSong()
            } else if (!MusicBotState.isPlaying() && MusicBotState.isQueueEmpty()) {
                MusicBotState.voiceChannel.leave()
            }
          }, 3000)
        })
      }
      
    getVideoId(string: string):string {
        const regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/
        const matches = string.match(regex)

        if (matches) {
            return matches[1]
        }

        return string
    }
      
  }
  
  export default new MusicBot()