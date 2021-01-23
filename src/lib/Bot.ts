import { Client, Guild, Message,  MessageReaction, User, VoiceState } from "discord.js";
import {CommandHandler} from './handlers/CommandHandler';
import { GuildCreateHandler } from "./handlers/GuildCreateHandler";
import { ReactionHandler } from "./handlers/ReactionHandler";
import { randomInt, setDefaultBotStatus } from "./Utils";

const AWS = require('aws-sdk');

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

        this.client.on('voiceStateUpdate', async(oldState: VoiceState, newState: VoiceState) => {});

        this.client.on('ready', async () => { 
            setDefaultBotStatus(this.client);
        });

        return await this.client.login(process.env.DISCORDBOTKEY);
    }
}
