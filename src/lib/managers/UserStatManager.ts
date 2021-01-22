import { Guild, User } from "discord.js";
import { UserStat } from "../../models/UserStat";

export class UserStatManager {

    static async addUserReaction(user: User, guild: Guild, count: number = 1): Promise<void> {
        
        let [userStat, created] = await this._getUserStat(user.id, guild.id);

        userStat.reactionCount += count;
        userStat.save();
    }

    static async addUserMessage(user: User, guild: Guild, count: number = 1): Promise<void> {

        let [userStat, created] = await this._getUserStat(user.id, guild.id);

        userStat.messageCount += count;
        await userStat.save();
    }

    static async addUserStreamTime(user: User, guild: Guild, minutes: number): Promise<void> {

        let [userStat, created] = await this._getUserStat(user.id, guild.id);

        userStat.streamingMinutes += minutes;
        await userStat.save();
    }
    

    static async addUserVoiceTime(user: User, guild: Guild, minutes: number): Promise<void> {
        let [userStat, created] = await this._getUserStat(user.id, guild.id);
        
        userStat.voiceTime += minutes;
        await userStat.save();
    }

    static async addUserQuizPoints(user: User, guild: Guild, amount: number): Promise<void> {
        let [userStat, created] = await this._getUserStat(user.id, guild.id);

        userStat.totalQuizPoints += amount;
        await userStat.save();
    }


    private static async _getUserStat(userId: string, guildId: string): Promise<[UserStat, boolean]> {
        
        return UserStat.findOrCreate({
            where: {guildId, userId},
            defaults: { messageCount: 0, streamingMinutes: 0, voiceTime: 0, reactionCount: 0}
        });  
        
    }
}
