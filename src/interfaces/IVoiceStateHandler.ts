import { Client, VoiceState } from "discord.js";

export interface IVoiceStateHandler {
    (err: unknown, client: Client, oldState: VoiceState, newState: VoiceState): Promise<any>;
}