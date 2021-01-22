import { Column, DataType, Index, Model, Table } from "sequelize-typescript";

@Table
export class Quiz extends Model<Quiz> {

    @Column
    @Index
    guildId: string;

    @Column
    @Index
    startedByUserId: string;

    @Column
    startedByUserName: string;

    @Column
    winnerUserId: string;

    @Column
    winnerUserName: string;

    @Column
    question: string;

    @Column
    answer: string;

    @Column
    @Index
    timeStarted: Date

    @Column(DataType.BIGINT)
    reward: number;
}
