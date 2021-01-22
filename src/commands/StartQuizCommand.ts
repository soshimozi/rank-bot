import { Client, Message, MessageAttachment, MessageEmbed, UserManager } from "discord.js";
import { stringify } from "querystring";
import { ICommand } from "../interfaces/ICommand";
import { IQuiz, QuizManager } from "../lib/managers/QuizManager";
import {decode} from 'html-entities';
import { Quiz } from "../models/Quiz";
import { BotState } from "../lib/BotState";
import { UserStatManager } from "../lib/managers/UserStatManager";
import { ConfigurationManager } from "../lib/managers/ConfigurationManager";


const markdownHighlight = "```";

export const startquiz:ICommand =  {
    name: 'startquiz',
    handler: async (client: Client, message:Message, ...parameters: string[]):Promise<void> => {

        let difficulty = 1;
        if(parameters.length > 0) {
            if(parameters[0].toLowerCase() === 'medium') {
                difficulty = 2
            } else if(parameters[0].toLowerCase() === 'hard') {
                difficulty = 3
            }
        }

        if(BotState[message.guild.id] && BotState[message.guild.id].currentQuiz) {
            await message.reply('there is already a quiz running.  Please wait until that quiz is complete.');
            return;
        }

        if(!BotState[message.guild.id]) {
            BotState[message.guild.id] = {};
        }

        const config = await ConfigurationManager.getConfiguration(message.guild.id);

        const MAX_DAILY_QUIZES:number = parseInt(config.maxDailyQuizzes) || 40;
        const MAX_USER_DAILY_QUIZES:number = parseInt(config.maxDailyUserQuizzes) || 20;

        const todayQuizes = await QuizManager.getCompletedQuizesForToday(message.guild.id);
        if(todayQuizes.length >= MAX_DAILY_QUIZES) {
             await message.reply("there have been too many quizes already today.  Please try again tomorrow.");
             return;
        }

        const userQuizes = await QuizManager.getCompletedQuizesForUser(message.author.id, message.guild.id);
        if(userQuizes.length >= MAX_USER_DAILY_QUIZES) {
            await message.reply("you have already started enough quizes today.  Please give someone else a try.  You can try again tomorrow.")
            return;
        }

        BotState[message.guild.id].currentQuiz = true;
        const result = await QuizManager.startQuiz(client, message, 30/difficulty, difficulty);
        BotState[message.guild.id].currentQuiz = false;

        if(result.winner) {

            console.log(result.winner);
            
            await message.channel.send(`${result.winner.username} got the correct answer and received ${result.winningAmount} points!`);

            await UserStatManager.addUserQuizPoints(result.winner, message.guild, result.winningAmount);

        } else {
            await message.channel.send(`${markdownHighlight}md\nTimes up!  The answer was\n--\n${(result.correctIndex + 1)}. ${decode(result.correctAnswer)}\n${markdownHighlight}`)
        }
    }
}