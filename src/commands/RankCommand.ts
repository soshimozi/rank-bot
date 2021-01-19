import { Client, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import {RankCard} from 'discord-canvas';
const canvacord = require("canvacord");
const moment = require('moment');

export const rank: ICommand = {
    name: 'showrank',
    description: 'Show current rank card',
    handler: async (client:Client, message:Message):Promise<void> => {

        let avatar = await canvacord.Canvas.circle(message.author.displayAvatarURL({ dynamic: false, format: 'png' }));

        // const rank = new canvacord.Rank()
        //     .setAvatar(message.author.displayAvatarURL({format: "png"}))
        //     .setCurrentXP(435)
        //     .setRequiredXP(1200)
        //     .setProgressBar("#FFFFFF", "COLOR")
        //     .setUsername(message.author.username)
        //     .setDiscriminator(message.author.discriminator);

        // let buffer = await rank.build();

        // TODO: add user stats :D
        const image = await new RankCard()
                            //.setAvatar(message.author.avatarURL({format: "png" }))
                            //.setAvatar(message.author.displayAvatarURL({dynamic: false, format: "png" }))
                            .setAvatar(avatar)
                            .setColor("background", "#296BC2") // BACKGROUND COLOR
                            .setColor("needed-xp", "#ffffff")
                            .setColor("background-bar", "#ffffff")
                            .setColor("bar", "#05CEF7")
                            .setColor("level", "#ffffff") // LEVEL COLOR
                            .setColor("level-box", "#05CEF7") // LEVEL COLOR
                            .setAddon("reputation", false) // Reputation box
                            .setBadge(1, null)
                            .setBadge(2, "diamond")
                            //.setBadge(3, "silver")
                            //.setBadge(4, "bronze")
                            .setXP("current", 500) // XP POINTS IN THIS RANK
                            .setXP("needed", 1500) // XP POINTS NECESSARY FOR THE NEXT RANK
                            .setRadius(50)
                            .setUsername(message.author.username)
                            .toAttachment();


        //let buffer = image.toBuffer();

        const attachment = new MessageAttachment(image.toBuffer(), "rankcard.png");
        await message.channel.send(attachment);
    },
};
