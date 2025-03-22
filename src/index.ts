import { Effect } from "effect";


interface FetchError {
  readonly _tag: "Fetch Error"
}

interface JSONError {
  readonly _tag: "JSON Error"
}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: (): FetchError => ({_tag: "Fetch Error"})
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JSONError => ({_tag: "JSON Error"})
  }); 

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() => fetch("/api/pokemon", {body: JSON.stringify(pokemon)}))

const main = fetchRequest.pipe(
  Effect.flatMap(jsonResponse),
  Effect.catchTags({
    "Fetch Error": () => Effect.succeed("Fetch Error"),
    "JSON Error": () => Effect.succeed("JSON Error")
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