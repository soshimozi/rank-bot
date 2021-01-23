import { Client, Message, TextChannel } from "discord.js";
import { ICommandHandler } from "../../interfaces/ICommandHandler";
import { BotState } from "../BotState";
import { CommandList } from "../CommandList";
import { BotStateManager } from "../managers/BotStateManager";
import { LevelManager } from '../managers/LevelManager';
import { PokemonManager } from "../managers/PokemonManager";
import { UserStatManager } from "../managers/UserStatManager";
import { randomInt, wrapWithMarkown } from "../Utils";
const moment = require("moment");
const _ = require('underscore');

export const CommandHandler:ICommandHandler = async (err: unknown,
    client: Client,
    message: Message,
    oldMessage?: Message): Promise<void> => {

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

    await checkForRandomEncounters(client, message);

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

    // music player messgaes handled by player
    if(message.content.toLowerCase() === '!skip' || message.content.toLowerCase() === '!catch') return;
    
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
    await message.channel.send(`I am sorry, but \`${commandName}\` is not a valid command.`);

};

const checkForRandomEncounters = async (client:Client, message:Message) => {
    
    let botState = BotStateManager.getBotState(message.guild.id);
    console.log('botState:', botState);

    if(moment().diff(moment(botState.nextEncounter || new Date())) < 0)
        return;

    let timeout = randomInt(2, 6);
    botState.nextEncounter = moment(botState.nextEncounter || new Date()).add(timeout, 'minutes');

    botState.currentPokemon = true;

    // get a random channel
    const randomChannel = message.guild.channels.cache.filter( (c) => c.type === 'text').random() as TextChannel;

    const pokemonList = await PokemonManager.getPokemonList(0, 180);

    const randomIndex = randomInt(0, pokemonList.results.length);
    const pokemonListItem = pokemonList.results[randomIndex];

    const markdown = wrapWithMarkown(`A [${pokemonListItem.name.toUpperCase()}] has appeard in the wild!  Look for it in the #${randomChannel.name} channel!`, 'css');
    await message.channel.send(markdown);

    const pokemonInfo = await PokemonManager.getPokemonInfo(pokemonListItem.name);
    

    let embed = {
        title: `${pokemonInfo.name.toUpperCase()}`,
        color: 0xffff66,
        description: `A pokemon has appeared!  You can use the **!catch** command to catch it.`,
        timestamp: new Date(),
        thumbnail: {
            url: `${pokemonInfo.sprites.front_default}`
        },
        fields: [
            {
                name: 'Points',
                value: `${pokemonInfo.base_experience}`,
                inline: false
            }
        ],
        footer: {
            text: 'Gotta catchem all!',
        }
    }

    await randomChannel.send({embed});

    let userTries = {};
    const filter = async response => {

        if(response.content !== '!catch') {
            return false;
        }
        
        if(userTries[response.author.id]) {
            // can't ask more than once
            return false;
        }

        //set the flag
        userTries[response.author.id] = true;

        // TODO: measure probabilty based on difficulty
        // also check against ball type which will be a parameter
        // afterwards adjust ball count for each player who attempted
        // for now no inventory and a flat rate of 33%

         let attempt = randomInt(0, 100);
         if(attempt <= 33) {
             return true;
         }

         await randomChannel.send(`Sorry ${response.author}, but you failed to catch the ${pokemonInfo.name} this time!`);
         return false;
    }

    let winner = null;
    let winningAmount = 0;

    try {
        let collected = await randomChannel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']})
        winner = collected.first().author;
    }
    catch(err) {
        await randomChannel.send(`It looks like nobody caught the ${pokemonInfo.name} this time!`);
    }

    if(winner !== null) {
        await randomChannel.send(`${winner} caught the ${pokemonInfo.name} for ${pokemonInfo.base_experience} points! `)
    }
}

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

