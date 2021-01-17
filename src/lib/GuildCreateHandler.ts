import { Client, Guild, MessageEmbed } from "discord.js";
import { sendToMessageOwner } from "./Utils";

export const GuildCreateHandler = async function (err: unknown,
    client: Client,
    guild: Guild): Promise<void> {
        
        if (!guild.available) return;
        
        const embed = new MessageEmbed({
            author: {
                name: "Hello, I'm HAL-9000!",
                iconURL: this.client.user.displayAvatarURL()
            },
            description: `You've just added me to **${guild.name}**.\n\nHere is some information about myself:\n\n`,
    
            timestamp: new Date(),
            footer: {
                text: this.client.user.tag
            }
        });
    

        sendToMessageOwner(guild, embed);

    }