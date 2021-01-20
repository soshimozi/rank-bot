import { IAuthorInfo } from "./IAuthorInfo";

export interface IPlaylistInfo {
    id: string,
    url: string,
    title: string,
    thumbnail?: string,
    author: IAuthorInfo
}