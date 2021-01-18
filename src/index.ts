require('dotenv').config(); // Recommended way of loading dotenv

import Bot from "./lib/Bot";
import { sequelize } from "./sequelize";
let bot = new Bot();

// sequelize.sync({force: false}).then( async () => {

//     console.log('Database initialized.');

//     try {
//         await bot.listen();
//         console.info('Bot has started');
//     }
//     catch(err) {
//         console.error(`Failed to log in: ${err}`);
//         throw err;
//     }
    
// }).catch((err) => {
//     console.error(`Failed to initialize database: ${err}`)
//     throw err;
// })

const main = async() => {

    try {
        await sequelize.sync({force: false});
        console.info('Database initialized');
    }
    catch(err) {
        console.error(`Failed to initialize database: ${err}`)
        throw err;
    }

    try {
        console.log('bot logging in and starting ...');
        await bot.listen();
        console.info('Bot has started');
    }
    catch(err) {
        console.error(`Failed to log in: ${err}`);
        throw err;
    }
}


main().then(() => {
    console.log('Success!')
}).catch((err) => {
    console.error('Unhandled exception: ', err)
});
