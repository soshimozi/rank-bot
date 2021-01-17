import { Client, Guild, GuildMember, Message,  MessageEmbed, MessageReaction, Speaking, User, VoiceState } from "discord.js";
import {CommandHandler} from './CommandHandler';
import { GuildCreateHandler } from "./GuildCreateHandler";
import { ReactionHandler } from "./ReactionHandler";

import { sendToMessageOwner } from "./Utils";

export default class Bot {
    
    client: Client;

    constructor() {
        this.client = new Client();
    }

    public async listen(): Promise<string> {

        
        this.client.on('message', async (message:Message) => await CommandHandler(null, this.client, message));
        this.client.on('messageUpdate', async(message:Message, oldMessage: Message) => await CommandHandler(null, this.client, message, oldMessage));

        this.client.on('guildCreate', async(guild:Guild) => await GuildCreateHandler(null, this.client, guild));

        this.client.on('messageReactionAdd', async(reaction:MessageReaction, user: User) => await ReactionHandler(null, this.client, reaction, user));

        this.client.on('voiceStateUpdate', async(oldState: VoiceState, newState: VoiceState) => {
             console.log('newState ', newState);
             console.log('oldState ', oldState);
        });

        this.client.on('ready', async () => { 
            await this.client.user.setActivity(`The Best Bot In the World`)
        });

        return this.client.login(process.env.TOKEN);
    }
}