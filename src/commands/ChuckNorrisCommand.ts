import axios, { AxiosResponse } from "axios"
import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const chucknorris:ICommand =  {
    name: 'chucknorris',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        var response:AxiosResponse<any>;
        try {
            response = await axios('https://api.chucknorris.io/jokes/random');
        }
        catch(err) {
            console.error(err);
            await message.reply('Could not retrieve a joke.')
            return;
        }
        
        let embed = {
            title: 'Chuck Norris Joke Generator',
            color: 0xff6600,
            author: {
                name: client.user.username,
                icon_url: `${client.user.avatarURL()}`,
            },
            type: 'Entertainment',
            timestamp: new Date(),
            thumbnail: {
                url: `${response.data.icon_url}`
            },
            description: `${response.data.value}`,
            footer: {
                text: 'Brought to you by BitwiseMobile Productions [www.bitwisemobile.com] and, of course, Caffeine.  Inspired by the greatest son in the world, Daniel.'
            }
        }

        await message.channel.send({embed});

    }
}

