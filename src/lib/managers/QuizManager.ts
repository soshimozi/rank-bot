import axios from "axios";
import { Client, Message, MessageAttachment, User } from "discord.js";
import { decode } from "html-entities";
import { Op } from "sequelize";
import { Quiz } from "../../models/Quiz";
const _ = require('underscore');

export interface IQuiz {
    category: string,
    type: ("multiple"|"boolean"),
    difficulty: ("easy"|"medium"|"hard"),
    question: string,
    correct_answer: string,
    incorrect_answers: string [],
}

export interface IQuizResult {
    winner: User, 
    winningAmount: number, 
    correctIndex: number, 
    correctAnswer: string    
}

export class QuizManager {
    static async getCompletedQuizesForToday(guildId: string):Promise<Quiz[]> {

        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();

        return Quiz.findAll({
            where:{ 
                timeStarted : {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW,
                },
                guildId: guildId
            }
        });
    }

    static async getCompletedQuizesForUser(userId: string, guildId: string):Promise<Quiz[]> {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();

        return Quiz.findAll({
            where:{
                timeStarted: { 
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                },
                startedByUserId: userId,
                guildId: guildId
            }
        });
    }

    static async getRandomQuiz():Promise<any> {
        const quizUrl = "https://opentdb.com/api.php?amount=1";

        const response = await axios.get(quizUrl);

        console.log('response.data: ', response.data.results[0]);

        return response.data.results[0];
    }

    static async startQuiz(client: Client, message: Message, quizTime: number = 30, difficultyFactor:number = 1.0): Promise<IQuizResult> {
        //TODO: make configurable
        const MAX_DAILY_QUIZES:number = 20;
        const MAX_USER_DAILY_QUIZES:number = 4;

        //TODO: make configurable
        const pointsMap = {easy : 200 * difficultyFactor, medium: 400 * difficultyFactor, hard: 800 * difficultyFactor };

        // TODO: look into possibly making this configurable
        //const quizIcon = new MessageAttachment('../assets/img/icon-2425861_640.png');

        const markdownHighlight = "```";

        let todayQuizes = await QuizManager.getCompletedQuizesForToday(message.guild.id);

        // // TODO: move into configuration database
        if(todayQuizes.length >= MAX_DAILY_QUIZES) {
             await message.reply("there have been too many quizes already today.  Please try again tomorrow.");
             return;
        }

        let userQuizes = await QuizManager.getCompletedQuizesForUser(message.author.id, message.guild.id);
        if(userQuizes.length >= MAX_USER_DAILY_QUIZES) {
            await message.reply("you have already started enough quizes today.  Please give someone else a try.  You can try again tomorrow.")
            return;
        }
        
        const quiz:IQuiz = await QuizManager.getRandomQuiz();

        let answers = [];

        answers.push({isAnswer: true, text: decode(quiz.correct_answer)});
        for(let incorrectAnswer of quiz.incorrect_answers) {
            answers.push({isAnswer: false, text: decode(incorrectAnswer)});
        }

        answers = _.shuffle(answers);

        // now get index of correct answer
        let correctIndex = _.findIndex(answers, (a) => a.isAnswer);


        let description = `${markdownHighlight}md\n${decode(quiz.question)}\n--\n`
        for(let index in answers) {
            description += `${(+index + 1)}. ${answers[index].text}\n`
        }
        description += markdownHighlight;

        let embed = {
            author: {
                name: "Quizinator",
                icon_url: 'https://hal-9000-bot-images.s3-us-west-2.amazonaws.com/icon-2425861_640.png'
            },
            color: 0x08000ff,
            description: description,
            fields: [
                {
                    name: "Question Is Worth",
                    value: pointsMap[quiz.difficulty],
                    inline: false
                }
            ],
            timestamp: new Date()
        };

        console.log(quiz);

        let usersAnswered = {};
        const filter = async response => {
            
            if(usersAnswered[response.author.id]) {
                // can't ask more than once
                return false;
            }

            //set the flag
            usersAnswered[response.author.id] = true;

            let index = parseInt(response.content);
            
            if(isNaN(index)) {
                return false;
            }
            
            if(index < 1 || index > answers.length) {
                return false;
            }

            return answers[index - 1].isAnswer;
        }

        await message.channel.send({embed});
        await message.channel.send(`Only your first answer will be selected and you have ${quizTime} seconds to answer.`);

        let winner = null;
        let winningAmount = 0;

        try {
            var collected = await message.channel.awaitMessages(filter, { max: 1, time: quizTime * 1000, errors: ['time']})

            winner = collected.first().author;
            winningAmount = pointsMap[quiz.difficulty];
        }
        catch(err) {
        }
        

        // update database
        await Quiz.create(
            {
                guildId: message.guild.id, 
                startedByUserId: message.author.id, 
                startedByUserName: message.author.username, 
                winnerUserId: winner ? winner.id : null, 
                winnerUserName: winner ? winner.username : null,
                question: quiz.question,
                answer: quiz.correct_answer,
                timeStarted: new Date(),
                reward: winningAmount
              });

        return {winner, winningAmount, correctIndex, correctAnswer: quiz.correct_answer};
    }
}

