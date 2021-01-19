import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const join:ICommand =  {
    name: 'join',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.type !== 'voice') {
            message.reply('I couldn\'t connect to your voice channel or the channel is not a voice channel...');
            return;
        }

        await voiceChannel.join();
    }
};