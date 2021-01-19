import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { Badge } from "../models/Badge";

export const addbadge:ICommand =  {
    name: 'addbadge',
    isAdmin: true,
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {
        let  type:string;
        let rank:string;
        let value:number;
        
        if(parameters.length > 0) {
            type = parameters[0];
        }

        if(parameters.length > 1) {
            rank = parameters[1];
        }

        if(parameters.length > 2) {
            value = parseInt(parameters[2]); 
        }

        if(!type) {
            await message.reply("You must supply a name for the badge.")
            return;
        }

        if(!rank) {
            await message.reply("You must supply a rank value for the badge.")
            return;
        }        

        if(!value) {
            await message.reply("You must supply a value for the badge.")
            return;
        }        

        var [badge, created] = await Badge.findOrCreate({
            where: {
                guildId: message.guild.id,
                badgeType: type,
                badgeRank: rank
            },
            defaults: {
                value: 0
            }
        });

        badge.value = value;
        await badge.save();
    }
};