import { Column, PrimaryKey, Model, DataType, Table } from "sequelize-typescript";

@Table
export class UserStat extends Model<UserStat> {

    @PrimaryKey
    @Column
    userId: string;

    @PrimaryKey
    @Column
    guildId: string;

    @Column(DataType.BIGINT)
    messageCount: number;

    @Column(DataType.BIGINT)
    streamingMinutes: number;

    @Column(DataType.BIGINT)
    voiceTime: number;

    @Column(DataType.BIGINT)
    totalQuizPoints: number;

    @Column(DataType.BIGINT)
    reactionCount: number;

}