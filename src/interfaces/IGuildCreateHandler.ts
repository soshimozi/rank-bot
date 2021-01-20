import { Client, Guild } from "discord.js";

export interface IGuildCreateHandler {
    (err: unknown, client: Client, guild: Guild): Promise<void>
}