import { CaughtMonster } from "../../models/CaughtMonster";
import { Trainer } from "../../models/Trainer";

const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();

/*

{"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=181&limit=181","previous":null,"results":[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"}
*/

export interface IPokemonSprites {
    front_default: string;
    front_shiny: string;
    front_female: string;
    from_shiny_female: string;
    back_default: string;
    back_shiny: string;
    back_female: string;
    back_shiny_female: string;
}

export interface IPokemonInfo {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    weight: number;
    sprites:IPokemonSprites;
}

export interface IPokemonListEntry {
    name: string;
    url: string;
}

export interface IPokemonListResult {
    count:number;
    next: string;
    previous: string;
    results: IPokemonListEntry[];
}

export class PokemonManager {

    static async getPokemonList(offset:number, limit: number) : Promise<IPokemonListResult> {
        var interval = {limit, offset};
        return await P.getPokemonsList(interval);
    }

    static async getPokemonInfo(name: string): Promise<IPokemonInfo> {
        return await P.getPokemonByName(name);
    }

    static async getTrainer(userId: string, guildId: string): Promise<[Trainer, boolean]> {
        return await Trainer.findOrCreate({where: {userId, guildId}, defaults: {userId, guildId}});
    }

    static async trainerCaughtPokemon(userId: string, guildId: string, pokemonId: number, exp: number): Promise<void> {
        let [trainer, created] = await this.getTrainer(userId, guildId);

        let caughtPokemon = await CaughtMonster.create({trainerId: trainer.id, pokemonId: pokemonId, exp, dateCaught: new Date(), trainer: trainer});
        await caughtPokemon.save();
    }
}