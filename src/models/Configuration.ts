import { Column, Index, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table
export class Configuration extends Model<Configuration> {
    @PrimaryKey
    @Column
    guildId: string;

    @PrimaryKey
    @Column
    key: string

    @Column
    value: string
}