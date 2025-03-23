import { Context, type Effect, type ParseResult } from "effect";
import type { Pokemon } from "./schemas";
import type { FetchError, JsonError } from "./errors";
import type { ConfigError } from "effect/ConfigError";

export interface PokeApi {
    readonly getPokemon: Effect.Effect<
        Pokemon,
        FetchError | JsonError | ParseResult.ParseError | ConfigError
    >;
}

export const PokeApi = Context.GenericTag<PokeApi>("PokeApi")