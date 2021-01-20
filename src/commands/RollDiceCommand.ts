import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import crypto from "crypto";
import DiceRollEvaluator from "../lib/DiceRoleEvaluator";

export const rolldice:ICommand =  {
    name: 'roll',
    usage: `${process.env.PREFIX}roll dice-formula.  See help for some examples.`,

    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        if(parameters.length < 1) {
            await message.reply(rolldice.usage);
            return;
        }

        // squish all parameters
        var diceStr:string = parameters.join('');


        let value:number;

        try {
            value = DiceRollEvaluator.evaluateRoll(diceStr);
            await message.channel.send(`${message.author.username} just rolled a ${value} with function ${diceStr} `);
        }
        catch(err) {
            await message.reply(`The formula you supplied is invalid.  Please supply a valid formula.  See help for some examples.`)
        }

        return;

    }
}
