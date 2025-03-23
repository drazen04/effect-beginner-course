import { Config, Context, Effect, Schema, type ParseResult } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import type { ConfigError } from "effect/ConfigError";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

interface PokeApiImpl {
    readonly getPokemon: Effect.Effect<
        Pokemon,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >;
}

/**
 * using class that extends Context.Tab is a convinient way to:
 * - avoid connflicts between service types
 *  - could be also achieved by creating and passing interface with unique symbol 
 * - having only one declaration/value
 * - collect all implementation inside the class as static member such as Live-Test-Mock-Dev
 */
export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
    static readonly Live = PokeApi.of({
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
    })
}