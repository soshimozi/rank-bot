export interface IBotState {
    currentQuiz?: boolean;
    currentPokemon?: boolean;
    nextEncounter?: Date;
}

export interface IBotStateCollection {
    [name: string]: IBotState
}

export const BotState:IBotStateCollection = {};