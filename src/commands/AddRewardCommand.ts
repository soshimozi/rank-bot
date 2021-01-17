import { Client, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { Reward } from "../models/Reward";

export const addreward:ICommand =  {
    name: 'addreward',
    role: 'Admin',
    isAdmin: true,
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> =>{
        let roleName:string;
        let level:number;

        if(parameters.length > 0) {
            roleName = parameters[0];
        }

        if(parameters.length > 1) {
            level = parseInt(parameters[1]); 
        }

        if(!roleName) {
            message.reply("You must supply a role for the reward.")
            return;
        }

        if(!level) {
            message.reply("You must supply a level value for the reward.")
            return;
        }

        let [reward, create] = await Reward.findOrCreate({
            where: {guildId: message.guild.id, roleName},
            defaults: { level: level }            
        });

        // update this role
        if(!create) {
            reward.level = level;
        }

        await reward.save();

        const exampleEmbed = new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle(`Reward ${create ? 'created' : 'updated'}`)
                                    .setAuthor(client.user.username, client.user.displayAvatarURL())
                                    .setDescription(`Reward ${create ? 'created' : 'updated'} for level ${level} using role ${roleName}`)

        message.channel.send(exampleEmbed);

    }
}