import { APIMessageContentResolvable, Client, Guild, Message, MessageAdditions, MessageEmbed, MessageOptions } from "discord.js";
import { fillTextWithTwemoji } from "@canvacord/emoji-parser";
//import { CanvasRenderingContext2D } from "canvas";

export const randomInt = (min: number, max: number):number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const setDefaultBotStatus = async (client:Client) => {
    await client.user.setActivity(`Falken's Maze`);
}

export const sendToMessageOwner = async (guild: Guild, whatToSend: APIMessageContentResolvable | (MessageOptions & { split?: false; }) | MessageAdditions): Promise<null> => {

    if(!guild.available) return; // Stops if unavailable

    var owner = await guild.members.fetch(guild.ownerID);

    if(owner) {
        console.log('sending ', whatToSend);

        owner.send(whatToSend);
    }
}

export const generateSuccessEmbed = (message:Message, title:string, description?:string) : MessageEmbed => {
    return generateEmbed(message, title, description).setColor(0x8ed938);
}

// static generateFailEmbed(message, title, description) {
//     return this.generateEmbed(message, title, description).setColor(0xec3c42);
// }

// static generateInfoEmbed(message, title, description) {
//     return this.generateEmbed(message, title, description).setColor(0x389ed9);
// }

const markdownHighlight = "```";

export const wrapWithMarkown = (str: string, lang: string): string => {
    return `${markdownHighlight}${lang}\n${str}\n${markdownHighlight}`;
}

const generateEmbed = (message:Message, title:string, description?:string) : MessageEmbed => {
    return new MessageEmbed({
        title: title,
        description: description || '',
        timestamp: new Date(),
        footer: {
            icon_url: message.author.displayAvatarURL(),
            text: message.author.tag
        },
    });
}

export const numPad = (num, size) => {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

/**
 * Gets variables and types
 * @param {object} canvas The canvas
 * @param {string} text The text
 * @param {number} defaultFontSize The default font pixel size
 * @param {number} width The max width of the text
 * @param {string} font The text font
 * @returns The variable formatted
 */
export const applyText = (canvas:any, text:string, defaultFontSize:number, width:number, font:string): any => {
    const ctx = canvas.getContext("2d");
    do {
        ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
    } while (ctx.measureText(text).width > width);
    return ctx.font;
};


/**
 * Shorten text.
 * @param {string} text Text to shorten 
 * @param {number} len Max Length
 * @returns {string}
 */
export const shorten = (text: string, len: number): string  => {
    if (typeof text !== "string") return "";
    if (text.length <= len) return text;
    return text.substr(0, len).trim() + "...";
};    


/**
 * Renders text with emoji
 * @param {CanvasRenderingContext2D} ctx CanvasRenderingContext2D
 * @param {string} msg Message
 * @param {number} x X
 * @param {number} y Y
 * @returns {Promise<void>}
 */
export const renderEmoji = async (ctx: any, msg: string, x: number, y: number): Promise<void> => {
    //return await fillTextWithTwemoji(ctx,  msg, x, y);
    return;
};

/**
 * Converts numbers into units like `1K`, `1M`, `1B` etc.
 * @param {number|string} num
 * @returns {string} 
 */
export const toAbbrev = (num: number | string): string => {
    if (!num || isNaN(num as number)) return "0";
    if (typeof num === "string") num = parseInt(num);
    let decPlaces = Math.pow(10, 1);
    var abbrev = ["K", "M", "B", "T"];
    for (var i = abbrev.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= num) {
            num = Math.round((num * decPlaces) / size) / decPlaces;
            if (num == 1000 && i < abbrev.length - 1) {
                num = 1;
                i++;
            }
            num = (num as number) + abbrev[i];
            break;
        }
    }

    return num as string;
}


export const giveHugs = (message: Message): boolean => {
    //if (message.content.toLowerCase().startsWith('hug')) { 

    console.log('giving hugs');
    
        let targetId = null;
        let isRole = false;

        let targetMember = message.mentions.members.first();
        if(!targetMember) { 
            let role = message.mentions.roles.first();

            if(role) {
                targetId = role.id;
                isRole = true;
            }

        }
        else {
            targetId = targetMember.user.id;
        }

        if(targetId != null) {
            // TODO: move gif into settings
            message.channel.send(`<@${isRole ? "&" : ""}${targetId}> ${isRole ? "everyone" : "you"} get${isRole ? "s" : ""} a hug!  https://tenor.com/view/anime-cuddle-cute-gif-12668750`);
            return true;
        } else {

            message.reply(' you need to tag a user or role in order to hug them!!');
            return false;
        }
    //}    

}
