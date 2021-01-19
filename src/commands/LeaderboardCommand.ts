import { Client, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { LevelManager } from '../lib/LevelManager';

export const leaderboard:ICommand = {
    name: 'leaderboard',
    description: 'Show current leaderboard',
    handler: async (client:Client, message:Message):Promise<void> => {
        let board = await LevelManager.getLeaderboard(message.guild.id);

        console.log('leaderboard: ', board);
    }
} 