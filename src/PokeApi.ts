import { Effect, Schema } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

/**
 * extract implementation is very useful to avoiding sync interface
 * and implementation itself.
 * So now we can use "typeof make" as shape declararion and only "make" as service implementation
 * 
 * With Effect.Service it is not needed anymore, but I will use it for better readability
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
 * using class that extends Context.Tag is a convenient way to:
 * - avoid conflicts between service types
 *  - could be also achieved by creating and passing interface with unique symbol 
 * - having only one declaration/value
 * - create all Layers inside the class as static attribute such as Live-Test-Mock-Dev
 */

/**
 * using class that extends Effect.Service is even more convenient way to create
 * a default service implementation and Layer without using make
 */

export class PokeApi extends Effect.Service<PokeApi>()(
    "PokeApi",
    {
        effect: make,
        dependencies: [PokemonCollection.Default, BuildPokeApiUrl.Default]
    }
) {}