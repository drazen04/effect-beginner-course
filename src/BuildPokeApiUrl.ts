import { Context } from "effect";

export class BuildPokeApiUrl extends Context.Tag("BuildPokeApiUrl")<
    BuildPokeApiUrl,
    ({name}: {name: string}) => string
>() {} 