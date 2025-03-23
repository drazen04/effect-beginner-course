import { Data, Effect, Schema } from "effect";

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number
}) {} 

const decodePokemon = Schema.decodeUnknown(Pokemon)

class FetchError extends Data.TaggedError("FetchError")<{}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: () => new FetchError()
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError()
  }); 

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() => fetch("/api/pokemon", {body: JSON.stringify(pokemon)}))


const program = Effect.gen(function* () {
  const request = yield* fetchRequest;
  if (!request.ok) {
    return yield* new FetchError();
  }
  const json = yield* jsonResponse(request);
  return yield* decodePokemon(json);
})

const main = program.pipe(
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