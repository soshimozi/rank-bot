import { IPlaylistInfo } from "./IPlaylistInfo";

export interface ISongInfo {
    title: string,
    requester: string,
    videoId: string,
    length: number,
    url: string,
    playlistInfo?: IPlaylistInfo
}