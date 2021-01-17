import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class Badge extends Model<Badge> {
    @PrimaryKey
    @Column
    guildId: string;

    @PrimaryKey
    @Column(DataType.ENUM('MESSAGE','REACTION','STREAM','VOICE'))
    badgeType : ('MESSAGE' | 'REACTION' | 'STREAM' | 'VOICE')
 
    @PrimaryKey
    @Column(DataType.ENUM('BRONZE','SILVER','GOLD','DIAMOND'))
    badgeRank : ('BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND')

    @Column(DataType.BIGINT)
    value: number;
}