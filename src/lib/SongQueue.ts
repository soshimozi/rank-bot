import { ISongInfo } from "../interfaces/ISongInfo";
import { ISongQueue } from "../interfaces/ISongQueue";

export class SongQueue implements ISongQueue {
    songs: ISongInfo[] = [];
    playing: boolean = false;
    paused: boolean = false;
    dispatcher = null;
    volume = 1;
}
