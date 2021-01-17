import { Client, Message } from "discord.js";
import { CommandList } from "./CommandList";
import { LevelManager } from './LevelManager';
import { UserStatManager } from "./UserStatManager";
import { randomInt } from "./Utils";

export const CommandHandler = async function (err: unknown,
    client: Client,
    message: Message,
    oldMessage?: Message): Promise<void> {

        if (err) {
            console.error(err);
            return;
        }

        if(!shouldHandleMessage(client, message, oldMessage)) {
            return;
        }

        // if it's a valid message then give some XP!
        await LevelManager.giveGuildUserExp(message.guild.member(message.author.id), message);
        await UserStatManager.addUserMessage(message.author, message.guild);

        // check if there are dargins in the message
        if(darginsBeHere(message)) {
            return;
        }

        // check if it's a hug message
        if(giveHugs(message)) {
            return;
        }
        
        // TODO: move prefix into settings?
        // is it a command?
        if(!message.content.startsWith(process.env.PREFIX)) {
            return;
        }

        // get rid of prefix
        const messageParts = message.content.split(" ");
        const commandName = messageParts[0].substr(1);
        const args = messageParts.slice(1);

        let isAdmin = message.guild.member(message.author.id).permissions.has('ADMINISTRATOR');

        // look for command by name in list
        for(const command of CommandList) {
            if (command.name === commandName) {
                
                // we found the command, but we can't execute it
                if(command.isAdmin && !isAdmin) {
                    message.guild.owner.send(`There was an attempt at using an admin command by ${message.author.username}`);
                    break;
                }

                await command.handler(client, message, ...args);
                return;
            }
        }


        // TODO: add setting to display this message or not
        message.channel.send(`I am sorry, but \`${commandName}\` is not a valid command.`);

    };

const giveHugs = (message: Message): boolean => {
    if (message.content.toLowerCase().startsWith('hug')) { 

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
    }    

};

// TODO: move into settings
const darginGuildId = "702988807233994775";

// TODO: move into settings
const zentamaUserId = "201875893398798336";

const darginsBeHere = (message: Message): boolean => {
    
    // TODO: move guild id into settings
    if(message.guild.id == darginGuildId && (message.content.toLowerCase().indexOf("dragon") != -1 || message.content.toLowerCase().indexOf("dargin") != -1)) {

        message.react("🐉");
        message.react("🐲");
        message.react("💯");

        // TODO: move id into settings
        message.channel.send(`Did you mention dargins?  The best dargin in the world is Zentama [<@${zentamaUserId}>], but his brother Zenato holds a close second.  Best darn dargins in the realm!  Very honorable and respectable.  All praises and honor to the best dargin in the world!`);
        
        const value = randomInt(0, 3);
        console.log('value: ', value);

        // TODO: create a list of dragon gif's and randomly select from them
        if(value > 1) {
            message.channel.send("https://tenor.com/view/dragons-lair-mad-anne-strokes-angry-rage-gif-9912246");
        } else {
            message.channel.send("https://tenor.com/view/dragon-pat-cute-pet-gif-17472506");
        }
        
       return true;
   }

   return false;
};

const shouldHandleMessage = (client: Client, message:Message, oldMessage?: Message):boolean => {
    
    // Ignore partial messages
    if(message.partial) return false;

    if(message.author.bot) return false;
    if(message.author.id === client.user.id) return false;

    // Make sure the edit actually changed the message content
    if(oldMessage && message.content === oldMessage.content) return false;

    // don't count DMs
    if(!message.guild) return false;

    return true;
};

