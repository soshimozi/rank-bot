import { Client, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
const { createCanvas, loadImage } = require('canvas')
import Canvas from 'canvas';
import RankCard from "../lib/RankCard";

export const testnodecanvas: ICommand = {
    name: 'testnodecanvas',
    description: 'Show current rank card',
    isAdmin: true,
    handler: async (client:Client, message:Message):Promise<void> => {     

        let image = await new RankCard()
                                .setAvatar(message.author.displayAvatarURL({format: "png"}))
                                .setUsername(message.author.username)
                                .setDiscriminator(message.author.discriminator)
                                .setLevel(55, "LVL")
                                .setBadge(1, "gold")
                                .setBadge(4, "silver")
                                .setBadge(9, "diamond")
                                .toBuffer();

        const attachment = new MessageAttachment(image, 'image.png');
        await message.channel.send(attachment);
    }
};
