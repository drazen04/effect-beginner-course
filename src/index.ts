import { Effect, Layer } from "effect";
import { PokeApi } from "./PokeApi";

const MainLayer = Layer.mergeAll(PokeApi.Live)

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
})

const runnable = program.pipe(Effect.provide(MainLayer))

const main = runnable.pipe(
  Effect.catchTags({
    "FetchError": () => Effect.succeed("Fetch Error"),
    "JsonError": () => Effect.succeed("Json Error"),
    "ParseError": () => Effect.succeed("Parse Error"),
  })
)

Effect.runPromise(main).then(console.log)

// Eager version
// const main = async () => {
//     const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
//     const json = await response.json();
//     return json;
//   };
  
//   main().then(console.log);