interface IBotState {
    currentQuiz: boolean
}

interface IBotStateCollection {
    [name: string]: IBotState
}

export const BotState:IBotStateCollection = {};