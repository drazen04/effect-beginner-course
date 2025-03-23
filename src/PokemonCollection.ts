import { Array, Context } from "effect";

export class PokemonCollection extends Context.Tag("PokemonCollection")<
    PokemonCollection,
    Array.NonEmptyArray<string>
>() {}