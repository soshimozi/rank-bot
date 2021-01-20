import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import crypto from "crypto";
import DiceRollEvaluator from "../lib/DiceRoleEvaluator";

export const rolldice:ICommand =  {
    name: 'rolldice',
    usage: `${process.env.PREFIX}rolldice dice-formula.  See help for some examples.`,

    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        if(parameters.length < 1) {
            await message.reply(rolldice.usage);
            return;
        }

        let value:number;

        try {
            value = DiceRollEvaluator.evaluateRoll(parameters[0]);
            await message.channel.send(`${message.author.username} just rolled a ${value} with function ${parameters[0]} `);
        }
        catch(err) {
            await message.reply(`The formula you supplied is invalid.  Please supply a valid formula.  See help for some examples.`)
        }
        // const dieNumber = parseInt(parameters[0].trim());
        // if(isNaN(dieNumber)) {
        //     await message.reply(rolldice.usage);
        //     return;
        // }

        // const validDice = [2, 4, 6, 8, 10, 12, 20, 100]
        // if(validDice.indexOf(dieNumber) === -1) {
        //     await message.reply(rolldice.usage);
        //     return;
        // }

        // const result = crypto.randomInt(1, dieNumber+1);

        //await message.channel.send(`${message.author.username} just rolled a ${result} on a 1d${dieNumber} `);
        return;

    }
}
