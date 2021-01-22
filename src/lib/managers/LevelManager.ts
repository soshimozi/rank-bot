import { GuildMember, Message, MessageEmbed } from "discord.js";
import moment = require("moment");
import { FindOptions, Op } from "sequelize";
import { Level } from "../../models/Level";
import { Reward } from "../../models/Reward";
import {randomInt, sendToMessageOwner, generateSuccessEmbed} from "../Utils";

export class LevelManager {
    
    static async getLeaderboardOffset(guildId:string, offset?:number): Promise<Level[]> {
        offset = offset || 0;

        let query:FindOptions = {
            where: {
                guildId: guildId
            },
            order: [['exp', 'DESC']],
            limit: offset
        };

        return Level.findAll(query);
    }

    static async getLeaderboard(guildId:string): Promise<Level[]> {

        let query:FindOptions = {where: { guildId: guildId }, order: [['exp', 'DESC']] };
        return Level.findAll(query);
    }

    static async giveGuildUserExp(member: GuildMember, message: Message): Promise<void> {
        
        let level = await LevelManager._getLevel(member.guild.id, member.user.id);

        if(moment().diff(moment(level.timeout || '', 'MMM Do YYYY, h:mm:ss a')) < 0)
            return;

        console.log('giving exp');
        
        level.timeout = moment().add(1, 'minutes').format('MMM Do YYYY, h:mm:ss a');

        const oldExp = level.exp;
        const oldLevel = LevelManager._getLevelFromExp(oldExp);
        const newExp = oldExp + randomInt(15, 25);
        const newLevel = LevelManager._getLevelFromExp(newExp);

        level.exp = newExp;
        await level.save();

        if(oldLevel != newLevel) {
            //message.reply(`congratulations on reaching level ${newLevel}!`);

            await message.channel.send({embed: generateSuccessEmbed(message, 'Level up!', `${member} just reached level ${newLevel}!`)});


            await LevelManager._updateUserRoles(member, message);
        }
    }
    
    private static async _updateUserRoles(member: GuildMember, message: Message) : Promise<void> {
        const exp = (await LevelManager._getLevel(member.guild.id, member.user.id)).exp;
        const lvl = LevelManager._getLevelFromExp(exp);

        if (lvl === 0) return;

        // find all rewards in this guild where level is less than lvl
        let rewards = await Reward.findAll({where: {guildId: message.guild.id, level: {[Op.lte]: lvl} }});

        rewards.forEach(async (reward) => {
            var role = member.guild.roles.cache.find((role) => role.name === reward.roleName);

            if(!role) {

                // TODO: remove the role from rewards
                await Reward.destroy({where: {guildId: member.guild.id, roleName: reward.roleName}});

                var embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`Level reward invalid!`)
                                .setAuthor(member.client.user.username, member.client.user.displayAvatarURL())
                                .setDescription(`Role with ID \`${reward.roleName}\` does not exist.\nRemoving the reward for you...`);

                sendToMessageOwner(message.guild, embed);
            }
            else {
                try {
                    await member.roles.add(role);
                }
                catch(err) {
                    console.error("Failed to assign role: ", err);

                    // TODO: add embed message h ere
                    return;
                }
            }
        });

        if(rewards.length > 0) {
            await message.channel.send(generateSuccessEmbed(message, 'Level up!', `${member.displayName} just reached level ${lvl}!`));
        }
    }

    private static _getLevelFromExp(exp: number): number {
        let level:number = 0;
        let levelExp:number = 0;

        while (exp >= LevelManager._getLevelExp(level)) {
            levelExp = LevelManager._getLevelExp(level);

            exp -= levelExp;
            level++;
        }

        return level;
    }

    private static _getLevelExp(level:number): number {
        return 5 * (Math.pow(level, 2) + 50 * level + 100);
    }

    private static async _getLevel(guildId: string, userId: string): Promise<Level> {

        let [level, created] = await Level.findOrCreate({
            where: {guildId, userId},
            defaults: { exp: 0 }
        });        

        return level;
    }    
    
}

//const levelManager = new LevelManager();

// export class LevelManagerFactory {
//     static getLevelManager(): ILevelManager {
//         return new LevelManager();
//     }
// }

//export const LevelManagerInst = new LevelManager();
