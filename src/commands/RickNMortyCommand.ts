import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const ricknmorty:ICommand =  {
    name: 'ricknmorty',
    usage: `${process.env.PREFIX}ricknmorty {character name}`,
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        if(parameters.length < 1) {
            await message.reply(ricknmorty.usage);
            return;
        }

        const apod_client = axios.create({
            baseURL: 'https://api.nasa.gov/planetary'
        });


    }
}

/*


https://rickandmortyapi.com/api

*/