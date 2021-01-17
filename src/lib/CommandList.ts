import { ICommand } from "../interfaces/ICommand";
import { addreward } from "../commands/AddRewardCommand";
import { leaderboard } from "../commands/LeaderboardCommand";
import {rank} from '../commands/RankCommand';
import { testnodecanvas } from "../commands/TestNodeCanvasCommand";
import { join } from "../commands/JoinCommand";
import { addbadge } from "../commands/AddBadgeCommand";

export const CommandList:ICommand[] = [rank, leaderboard, addreward, testnodecanvas, join, addbadge];