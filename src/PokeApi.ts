import { Context, Effect, Schema } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

/**
 * extract implementation is very useful to avoiding sync interface
 * and implementation itself.
 * So now we can use "typeof make" as shape declararion and only "make" as concrete implementation 
 */
const make = {
    getPokemon: Effect.gen(function* () {
        const pokemonCollection = yield* PokemonCollection;
        const buildPokeApiUrl = yield* BuildPokeApiUrl;
        
        const requestUrl = buildPokeApiUrl({
            name: pokemonCollection[0]
        })
        
        const response = yield* Effect.tryPromise({
            try: () => fetch(requestUrl),
            catch: () => new FetchError()
        });
        
        if (!response.ok) {
            return yield* new FetchError();
        }
        
        const json = yield* Effect.tryPromise({
            try: () => response.json(),
            catch: () => new JsonError()
        });
        
        return yield* Schema.decodeUnknown(Pokemon)(json);
    })
}

/**
 * using class that extends Context.Tab is a convinient way to:
 * - avoid connflicts between service types
 *  - could be also achieved by creating and passing interface with unique symbol 
 * - having only one declaration/value
 * - collect all implementation inside the class as static member such as Live-Test-Mock-Dev
 */
export class PokeApi extends Context.Tag("PokeApi")<PokeApi, typeof make>() {
    static readonly Live = PokeApi.of(make)
}