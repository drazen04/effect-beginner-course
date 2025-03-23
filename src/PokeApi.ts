import { Config, Context, Effect, Schema, type ParseResult } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import type { ConfigError } from "effect/ConfigError";

export interface PokeApi {
    readonly getPokemon: Effect.Effect<
        Pokemon,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >;
}

export const PokeApi = Context.GenericTag<PokeApi>("PokeApi")

export const PokeApiLive = PokeApi.of({
    getPokemon: Effect.gen(function* () {
      const baseUrl = yield* Config.string("BASE_URL");
    
      const response = yield* Effect.tryPromise({
        try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
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