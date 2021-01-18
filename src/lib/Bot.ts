import { Client, Guild, GuildMember, Message,  MessageEmbed, MessageReaction, Speaking, User, VoiceState } from "discord.js";
import {CommandHandler} from './CommandHandler';
import { GuildCreateHandler } from "./GuildCreateHandler";
import { ReactionHandler } from "./ReactionHandler";

import { sendToMessageOwner } from "./Utils";
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

        this.client.on('voiceStateUpdate', async(oldState: VoiceState, newState: VoiceState) => {
             console.log('newState ', newState);
             console.log('oldState ', oldState);
        });

        this.client.on('ready', async () => { 
            await this.client.user.setActivity(`The Best Bot In the World`)
        });

        let secret = await this.getToken();
        let parsed = JSON.parse(secret);
        return await this.client.login(parsed.token/*process.env.TOKEN*/);
    }

    async getToken(): Promise<any> {
        // get token from secrets manager

        const  region = "us-west-2",
        secretName = "hal-9000-bot/config";

        // Create a Secrets Manager client
        var client = new AWS.SecretsManager({
            region: region
        });        

        return new Promise((resolve, reject) => {

            console.log('about to call getSecretValue from client');

            client.getSecretValue({SecretId: secretName}, function(err, data) {

                console.log('received a response');

                if (err) {

                    console.error(err);

                    if (err.code === 'DecryptionFailureException') {
                        // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                        // Deal with the exception here, and/or rethrow at your discretion.
                        reject(err);
                    }
                    else if (err.code === 'InternalServiceErrorException') {
                        // An error occurred on the server side.
                        // Deal with the exception here, and/or rethrow at your discretion.
                        reject(err);
                    }
                    else if (err.code === 'InvalidParameterException')
                        // You provided an invalid value for a parameter.
                        // Deal with the exception here, and/or rethrow at your discretion.
                        reject(err);
                    else if (err.code === 'InvalidRequestException')
                        // You provided a parameter value that is not valid for the current state of the resource.
                        // Deal with the exception here, and/or rethrow at your discretion.
                        reject(err);
                    else if (err.code === 'ResourceNotFoundException')
                        // We can't find the resource that you asked for.
                        // Deal with the exception here, and/or rethrow at your discretion.
                        reject(err);
                }
                else {
                    // Decrypts secret using the associated KMS CMK.
                    // Depending on whether the secret is a string or binary, one of these fields will be populated.
                    if ('SecretString' in data) {
                        resolve(data.SecretString);
                    } else {
                        let buff = Buffer.from(data.SecretBinary, 'base64');
                        resolve(buff.toString('ascii'));
                    }
                }
            });
        });
    }
}
