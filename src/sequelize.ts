import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASENAME,
  models: [__dirname + '/models']
});
