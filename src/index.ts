import { error } from "console";
import { Effect } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);

interface FetchError {
  readonly _tag: "Fetch Error"
}

interface JSONError {
  readonly _tag: "JSON Error"
}

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): FetchError => ({_tag: "Fetch Error"})
  }); 

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise({
    try: () => fetch("/api/pokemon", {body: JSON.stringify(pokemon)}),
    catch: (): JSONError => ({_tag: "JSON Error"})
  })

const main = fetchRequest.pipe(
  Effect.flatMap(jsonResponse),
  Effect.catchTag("UnknownException", 
    () => Effect.succeed("There was an error")
  ),
  Effect.flatMap(savePokemon),
)

Effect.runPromise(main).then(console.log)

// Eager version
// const main = async () => {
//     const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
//     const json = await response.json();
//     return json;
//   };
  
//   main().then(console.log);