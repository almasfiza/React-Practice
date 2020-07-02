import './App.css';
import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';

function App() {
  //setPokemon function updates the state of pokemon which will
  // be later passed to the PokemonList to generate the pokemon list
    const [pokemon, setPokemon] = useState([]);
    const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon")
    const [nextPageUrl, setNextPageUrl]= useState("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20")
    const [prevPageUrl, setPrevPageUrl]= useState(null)
    const [loading,setLoading] = useState(true)
    
    useEffect(() => {
          setLoading(true)
          let cancel
          axios.get(currentPageUrl,{
              cancelToken: new axios.CancelToken(c=>cancel = c)
          }).then( res => {
          setLoading(false)
          setNextPageUrl(res.data.next)
          setPrevPageUrl(res.data.previous)
          setPokemon(res.data.results.map(p => p.name))
        })
    
    //set up what happens if useEffect is called multiple times in a row before
    // the request is granted. To avoid teh race condition, make sure that
    // everytime before a new request is called, clear the old request
    return() => cancel()
    },[currentPageUrl])
    
    //go to next page
    function gotoNextPage(){
      setCurrentPageUrl(nextPageUrl)
    }
    //go to previous page
    function gotoPrevPage(){
      setCurrentPageUrl(prevPageUrl)
    }
    
    if (loading) return "Loading..."
    
    return (
      <>
        <PokemonList pokemon={pokemon}/>
        <Pagination 
        gotoNextPage = {nextPageUrl ? {gotoNextPage} : null}
        gotoPrevPage = {prevPageUrl ? {gotoPrevPage} :null}
        />
      </>
    );
}

export default App;
