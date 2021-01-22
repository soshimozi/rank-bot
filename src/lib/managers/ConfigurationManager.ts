import { Configuration } from "../../models/Configuration";
const _ = require('underscore');

export class ConfigurationManager {
    static async getConfiguration(guildId: string): Promise<any> {
        
        let configurationRecords = await Configuration.findAll({where: {guildId: guildId}});

        let configValues = []
        for(let configuration of configurationRecords) {
            configValues.push([configuration.key, configuration.value])
        }

        return (_.object(configValues));
    }   
}