import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const help:ICommand =  {
    name: 'help',
    isAdmin: true,
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        // we can ignore args for help
        let tosend = [
            '```xl', 
            `${process.env.PREFIX}join : "Join Voice channel of msg sender"`,	        
            `${process.env.PREFIX}addsong : "Add a valid youtube link to the queue"`, 
            `${process.env.PREFIX}addplaylist : "Adds a youtube playist by id to the queue."`, 
            `${process.env.PREFIX}showqueue : "Shows the current queue, up to 15 songs shown."`, 
            `${process.env.PREFIX}play : "Play the music queue if already joined to a voice channel"`, 
            '', 
            'the following commands only function while the play command is running:'.toUpperCase(), 
            `${process.env.PREFIX}pause : "pauses the music"`,	
            `${process.env.PREFIX}resume : "resumes the music"`, 
            `${process.env.PREFIX}skip : "skips the playing song"`, 
            `${process.env.PREFIX}repeat : "Repeat the current song until skipped"`,	
            `${process.env.PREFIX}time : "Shows the playtime of the song."`,	
            `${process.env.PREFIX}volume (number) : "Sets volume to value.  Volume is any value between 0 and 10"`,	
            '```'
        ];

		await message.channel.send(tosend.join('\n'));
    }
}


/*

        // we can ignore args for help
        let tosend = [
            '```xl', 
            process.env.PREFIX + 'join : "Join Voice channel of msg sender"',	        
            process.env.PREFIX + 'add : "Add a valid youtube link to the queue"', 
            process.env.PREFIX + 'playlist : "Adds a youtube playist by id to the queue."', 
            process.env.PREFIX + 'queue : "Shows the current queue, up to 15 songs shown."', 
            process.env.PREFIX + 'play : "Play the music queue if already joined to a voice channel"', 
            '', 
            'the following commands only function while the play command is running:'.toUpperCase(), 
            process.env.PREFIX + 'pause : "pauses the music"',	
            process.env.PREFIX + 'resume : "resumes the music"', 
            process.env.PREFIX + 'skip : "skips the playing song"', 
            process.env.PREFIX + 'repeat : "Repeat the current song until skipped"',	
            process.env.PREFIX + 'time : "Shows the playtime of the song."',	
            'volume+(+++) : "increases volume by 2%/+"',	
            'volume-(---) : "decreases volume by 2%/-"', 
            '```'
        ];

		return message.channel.send(tosend.join('\n'));

*/