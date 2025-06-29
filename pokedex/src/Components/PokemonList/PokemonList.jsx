import { useEffect , useState} from "react";
import axios from 'axios';
import Pokemon from "../Pokemon/Pokemon"

import './PokemonList.css'

function PokemonList() {

  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    
  const [pokedexUrl , setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');

  const [nextUrl , setNextUrl] = useState('');
  const [prevUrl , setPrevUrl] = useState('');

  async function downloadPokemons() {
    setIsLoading(true);
    const response = await axios.get(pokedexUrl);//this downloads list of 20 pokemons
    const pokemonResults = response.data.results;//we get an array of pokemons that contains pokemon name and their urls
    console.log(response.data);//if u see console then u will get key of next and prev
    setNextUrl(response.data.next);
    setPrevUrl(response.data.previous);

    //Now iterating over the array of pokemons and using their url.to create an array of promises
    //that will download those 20 pokemons
    const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
    
    //passing that promise array to axios.all
    const pokemonData = await axios.all(pokemonResultPromise);//it will return only when ahen all the data will be downloaded from the promises array
    console.log(pokemonData)//array of 20 pokemon detailed data
    
    //now iterate on the data of each  pokemon and extract id,name,image , types
    const pokeListResult = (pokemonData.map((pokeData)=>{
      const pokemon = pokeData.data;
      return {
        id: pokemon.id,
        name:pokemon.name,
        image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.other.dream_world.front_shiny,
        types: pokemon.types
      } 
    }))
    console.log(pokeListResult);
    setPokemonList(pokeListResult);
    setIsLoading(false);
  }

  useEffect(() => {
    // define and immediately call an async function
    (async () => {
      await downloadPokemons();
    })();
  }, [pokedexUrl]);

  return (
    <div className="pokemon-list-wrapper">
      
      <div className="pokemon-wrapper">
          {(isLoading) ? 'Loading' :
          pokemonList.map((p)=><Pokemon name = {p.name} image = {p.image} key = {p.id} id = {p.id} />)
      }
      </div>

      <div className="controls">
        <button disabled = {prevUrl == null} onClick={()=>setPokedexUrl(prevUrl)} >Prev</button>
        <button disabled = {nextUrl == null} onClick={()=>setPokedexUrl(nextUrl)} >Next</button>
      </div>
    </div>
  );
}

export default PokemonList;
