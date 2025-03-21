const main = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
    const json = await response.json();
    return json;
  };
  
  main().then(console.log);