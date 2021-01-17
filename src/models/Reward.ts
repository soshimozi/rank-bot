import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class Reward extends Model<Reward> {
    
    @PrimaryKey
    @Column
    guildId: string;

    @PrimaryKey
    @Column
    roleName: string

    @Column(DataType.BIGINT)
    level: number
}
