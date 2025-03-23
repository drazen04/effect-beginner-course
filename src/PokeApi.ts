import { Context, Effect, Layer, Schema } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

/**
 * extract implementation is very useful to avoiding sync interface
 * and implementation itself.
 * So now we can use "typeof make" as shape declararion and only "make" as service implementation 
 */
const make = Effect.gen(function* () {
    /**
     * Lift dependencies at service level since multiple functions could use them
     */
    const pokemonCollection = yield* PokemonCollection;
    const buildPokeApiUrl = yield* BuildPokeApiUrl;

    return {
        getPokemon: Effect.gen(function* () {
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
})

/**
 * using class that extends Context.Tag is a convinient way to:
 * - avoid conflicts between service types
 *  - could be also achieved by creating and passing interface with unique symbol 
 * - having only one declaration/value
 * - create all Layers inside the class as static attribute such as Live-Test-Mock-Dev
 */
export class PokeApi extends Context.Tag("PokeApi")<PokeApi, Effect.Effect.Success<typeof make>>() {
    static readonly Live = Layer.effect(this, make).pipe(
        Layer.provide(
            Layer.mergeAll(
                PokemonCollection.Default,
                BuildPokeApiUrl.Default
            )
        )
    );

    static readonly Mock = Layer.succeed(
        this,
        PokeApi.of({
            getPokemon: Effect.succeed({
                id: 1,
                name: "snorlax",
                height: 25,
                weight: 134,
                order: 1
            })
        })
    )
}