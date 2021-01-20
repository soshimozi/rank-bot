import { Client, Message, VoiceState } from "discord.js";
import { IVoiceStateHandler } from "../../interfaces/IVoiceStateHandler";

export const VoiceStateHandler:IVoiceStateHandler = async (err: unknown,
    client: Client, oldState: VoiceState, newState: VoiceState): Promise<void> => {
}