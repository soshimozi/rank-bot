import { ICommand } from "../interfaces/ICommand";
import { addreward } from "../commands/AddRewardCommand";
import { leaderboard } from "../commands/LeaderboardCommand";
import {rank} from '../commands/RankCommand';
import { testnodecanvas } from "../commands/TestNodeCanvasCommand";
import { join } from "../commands/JoinCommand";
import { addbadge } from "../commands/AddBadgeCommand";
import { addsong } from "../commands/AddSongCommand";
import { play } from "../commands/PlayCommand";
import { pause } from "../commands/PauseCommand";
import { resume } from "../commands/ResumeCommand";
import { volume } from "../commands/VolumeCommand";
import { showqueue } from "../commands/ShowQueueCommand";
import { addplaylist } from "../commands/AddPlaylistCommand";
import { help } from "../commands/HelpCommand";
import { apod } from "../commands/ApodCommand";
import { time } from "../commands/TimeCommand";
import { repeat } from "../commands/RepeatCommand";

export const CommandList:ICommand[] = 
        [help, rank, leaderboard, addreward, testnodecanvas, addbadge, apod, time, repeat,
        join, addsong, play, pause, resume, volume, showqueue, addplaylist];