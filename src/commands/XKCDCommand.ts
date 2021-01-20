import axios from "axios";
import { Client, Message, MessageAttachment } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const xkcd:ICommand =  {
    name: 'xkcd',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        try {
            const response = await axios("https://xkcd.com/info.0.json");

            const attachment = new MessageAttachment(response.data.img);

            // Send the attachment in the message channel
            message.channel.send(attachment);
        

        }
        catch(err) {
            console.error(err);
            message.reply("Failed to get an XKCD strip.")
        }


    }
}

/*

    const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
    // Send the attachment in the message channel
    message.channel.send(attachment);
*/