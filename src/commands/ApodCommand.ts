import axios from "axios";
import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";

export const apod:ICommand =  {
    name: 'apod',
    description: "Astronomy Picture of the Day! If you use just the 'apod' command, today's APOD will show up. Optionally you can say 'apod random', and I'll pick one out of a hat.",
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        
        let queryDate:string = null;

        if(parameters.length > 0 && parameters[0].toLowerCase() === 'random') {
            queryDate = randomDate(new Date(1998, 0, 1), new Date());
        }

        const apod_client = axios.create({
            baseURL: 'https://api.nasa.gov/planetary'
        });


        let res = await apod_client.get('/apod', {
            params: {
                date: queryDate,
                api_key: process.env.APODAPIKEY
            }
        });

        await message.channel.send({
            embed: {
                color: 3447003,
                title: res.data.title,
                description: res.data.explanation,
                image: {
                    url: res.data.hdurl
                },
                footer: {
                    text: res.data.copyright ? "Credit: " + res.data.copyright : null
                },
                timestamp: new Date(res.data.date)
            }
        });
    }
}

function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
