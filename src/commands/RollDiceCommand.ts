import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import crypto from "crypto";

export const rolldice:ICommand =  {
    name: 'rolldice',
    usage: `${process.env.PREFIX}rolldice {die number}, where die number is in [2,4,6,8,10,12,20,100]`,

    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        if(parameters.length < 1) {
            await message.reply(rolldice.usage);
            return;
        }

        const dieNumber = parseInt(parameters[0]);
        if(isNaN(dieNumber)) {
            await message.reply(rolldice.usage);
            return;
        }

        const validDice = [2, 4, 6, 8, 10, 12, 20, 100]
        if(validDice.indexOf(dieNumber) === -1) {
            await message.reply(rolldice.usage);
            return;
        }

        const result = crypto.randomInt(1, dieNumber);

        await message.channel.send(`${message.author.username} just rolled a ${result} on a 1d${dieNumber} `);
        return;

    }
}
