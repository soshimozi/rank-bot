import { MessageCollector, StreamDispatcher } from "discord.js";
import { ISongInfo } from "./ISongInfo";

export interface ISongQueue {

    songs: ISongInfo[];
    playing: boolean;
    paused: boolean;
    dispatcher?: StreamDispatcher;
    collector?: MessageCollector;
    volume:number;
}
