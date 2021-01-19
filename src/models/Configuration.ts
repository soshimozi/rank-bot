import { Column, Index, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table
export class Configuration extends Model<Configuration> {
    @PrimaryKey
    @Column
    guildId: string;

    @Unique
    @Column
    key: string

    @Column
    value: string
}