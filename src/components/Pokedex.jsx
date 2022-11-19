import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'
import PokemonCard from './PokemonCard';
import { useNavigate } from 'react-router-dom';
import style from './pokedex.css'
import logoHeader from '../assets/logo-header.svg'

const Pokedex = () => {

  const userNameTrainer = useSelector(state => state.name)
  const [pokemons, setPokemons] = useState([])
  const [pokemonName, setPokemonName ]= useState('')
  const [typePokemon, setTypePokemon] = useState([])
  
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=905')
      .then(res => setPokemons(res.data.results))

    axios.get('https://pokeapi.co/api/v2/type')
      .then(res => setTypePokemon(res.data.results))
  },[])





  const serachPokemon= ()=> {
    navigate(`/pokedex/${pokemonName}`)
  }

  const filterType = (e) => {
    const url= e.target.value
    axios.get(url)
      .then(res=> setPokemons(res.data.pokemon))
    // console.log(pokemons)
  }

// pagination
  const [page, setPage] = useState(1);
  const pokemonsPerPage = 20;
  const lastIndex = page * pokemonsPerPage;
  const firstIndex = lastIndex - pokemonsPerPage;
  const pokemonPaginated = pokemons.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(pokemons.length / pokemonsPerPage)

  const numbers = [];
  for(let i = 1; i <= totalPages; i++){
    numbers.push(i)
  }

  return (
    <div>
      <header>
        <img src={logoHeader} alt="" />
      </header>
      <main>
        <section className='search-pokemon'>
          <p><span>Welcome {userNameTrainer}!,</span> here you can find your favorite pokemon</p>
          <div>
            <label>
              <input list='pokemons' name='pokemons'
                placeholder='Search name'
                value={pokemonName}
                onChange={e => setPokemonName(e.target.value)}
              />
              <datalist id='pokemons' >
                {pokemons.map(pokemon =>(
                  <option value={pokemon.name} key={pokemon.name}></option>
                ))}
              </datalist>
              <button onClick={serachPokemon}>search</button>
            </label>


            <select onChange={filterType} name="" id="">
              {typePokemon.map(type =>(
                <option 
                  value={type.url}
                  key ={type.name}
                >{type.name}</option>
              ))}
            </select>

          </div>
        </section>
        
        <section className='pagination'>
          <button 
            onClick={() => setPage(page-1)}
            disabled = {page === 1}
          >Prev Page</button>

          <button 
            onClick={() => setPage(page+1)}
            disable = {page === totalPages}
          >Next Page</button>
          {numbers.map(number => (
            <button onClick={() => setPage(number)}>{number}</button>
          ))}
          
        </section>

        <section>
          <ul>
            {pokemonPaginated.map(pokemon => (
              <PokemonCard url={pokemon.url ? pokemon.url : pokemon.pokemon.url} key={pokemon.url ? pokemon.url : pokemon.pokemon.url}/>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Pokedex;


// Antes del filtro:
// character = {
//     name: "...",
//     url: "https:"
//     ...
// }

// character = "https://"

//POKEMON

// Antes del filtro
// pokemon = {
//     "name": "ivysaur",
//     "url": "https://pokeapi.co/api/v2/pokemon/2/"
// }
// pokemon.url

// Despues del filtro
// pokemon = {
//     "pokemon": {
//         "name": "pidgey",
//         "url": "https://pokeapi.co/api/v2/pokemon/16/"
//     },
//     "slot": 1
// }
// pokemon.pokemon.url