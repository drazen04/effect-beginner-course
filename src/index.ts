import { Effect, Layer, ManagedRuntime } from "effect";
import { PokeApi } from "./PokeApi";

const MainLayer = Layer.mergeAll(PokeApi.Default)

/**
 * Runtime is convient collect Layers and run the program without using Effect.provide
 */
const PokemonRuntime = ManagedRuntime.make(MainLayer)

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
})

// const runnable = program.pipe(Effect.provide(MainLayer))

const main = program.pipe(
  Effect.catchTags({
    "FetchError": () => Effect.succeed("Fetch Error"),
    "JsonError": () => Effect.succeed("Json Error"),
    "ParseError": () => Effect.succeed("Parse Error"),
  })
)

PokemonRuntime.runPromise(main).then(console.log)

// Eager version
// const main = async () => {
//     const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
//     const json = await response.json();
//     return json;
//   };
  
//   main().then(console.log);