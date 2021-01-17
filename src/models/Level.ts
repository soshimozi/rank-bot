import {Table, Column, Model, PrimaryKey, DataType} from 'sequelize-typescript';
 
@Table
export class Level extends Model<Level> {

    @PrimaryKey
    @Column
    userId: string;

    @PrimaryKey
    @Column
    guildId: string;

    @Column(DataType.BIGINT)
    exp: number;

    @Column
    timeout: string;
}
