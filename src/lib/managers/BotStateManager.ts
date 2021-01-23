import { BotState, IBotState } from "../BotState";

export class BotStateManager {
    static getBotState(guildId: string):IBotState {
        if(!BotState[guildId]) {
            BotState[guildId] = {};
        }

        return BotState[guildId];
    }
}