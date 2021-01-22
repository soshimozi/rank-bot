import { Client, Message, MessageAttachment, MessageEmbed, UserManager } from "discord.js";
import { stringify } from "querystring";
import { ICommand } from "../interfaces/ICommand";
import { IQuiz, QuizManager } from "../lib/managers/QuizManager";
import {decode} from 'html-entities';
import { Quiz } from "../models/Quiz";
import { BotState } from "../lib/BotState";
import { UserStatManager } from "../lib/managers/UserStatManager";


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

        BotState[message.guild.id].currentQuiz = true;
        let result = await QuizManager.startQuiz(client, message, 30/difficulty, difficulty);
        BotState[message.guild.id].currentQuiz = false;

        if(result.winner) {
            await message.channel.send(`${result.winner.username} got the correct answer and received ${result.winningAmount} points!`);

            await UserStatManager.addUserQuizPoints(result.winner, message.guild, result.winningAmount);

        } else {
            await message.channel.send(`${markdownHighlight}md\nTimes up!  The answer was\n--\n${(result.correctIndex + 1)}. ${decode(result.correctAnswer)}\n${markdownHighlight}`)
        }
    }
}