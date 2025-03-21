import { Effect } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);
const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json()); 

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() => fetch("/api/pokemon", {body: JSON.stringify(pokemon)}))

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