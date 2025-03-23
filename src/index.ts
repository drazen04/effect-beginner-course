import { Config, Data, Effect, Schema } from "effect";
import { Pokemon } from "./schemas";


class FetchError extends Data.TaggedError("FetchError")<{}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}


const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() => fetch("/api/pokemon", {body: JSON.stringify(pokemon)}))


const getPokemon = Effect.gen(function* () {
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

const main = getPokemon.pipe(
  Effect.catchTags({
    "FetchError": () => Effect.succeed("Fetch Error"),
    "JsonError": () => Effect.succeed("Json Error"),
    "ParseError": () => Effect.succeed("Parse Error"),
  })
  // still not working Effect.flatMap(savePokemon), 
)

Effect.runPromise(main).then(console.log)

// Eager version
// const main = async () => {
//     const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
//     const json = await response.json();
//     return json;
//   };
  
//   main().then(console.log);