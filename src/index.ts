import { Effect } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);
const jsonResponse = (response: Response) =>
          Effect.tryPromise(() => response.json()); 

const main = Effect.flatMap(fetchRequest, jsonResponse)

Effect.runPromise(main)

// Eager version
// const main = async () => {
//     const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
//     const json = await response.json();
//     return json;
//   };
  
//   main().then(console.log);