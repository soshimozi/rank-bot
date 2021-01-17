require('dotenv').config(); // Recommended way of loading dotenv

import Bot from "./lib/Bot";
import { sequelize } from "./sequelize";
let bot = new Bot();


sequelize.sync({force: false}).then( async () => {

    console.log('Database initialized.');

    try {
        await bot.listen();
        console.info('Bot has started');
    }
    catch(err) {
        console.error(`Failed to log in: ${err}`);
    }
    
}).catch((err) => {
    console.error(`Failed to initialize database: ${err}`)
})

