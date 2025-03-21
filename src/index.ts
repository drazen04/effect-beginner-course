const fetchRequest = () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
const fetchResponse = (response: Response) => response.json()

const main = async () => {
    const response = await fetchRequest();
    const json = await fetchResponse(response);
    return json;
  };
  
  main().then(console.log);