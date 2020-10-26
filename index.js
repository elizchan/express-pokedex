require('dotenv').config();
const express = require('express');
const axios = require('axios'); 
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./models')

app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

// GET / - main index of site
app.get('/', function(req, res) {
  const pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
  // Use request to call the API
  axios.get(pokemonUrl).then( function(apiResponse) {
    const pokemon = apiResponse.data.results;
    res.render('index', { pokemon: pokemon.slice(0, 151) });
  })
});

// POST /pokemon - receive the name of a pokemon and add it to the database
app.post('/pokemon', function(req, res) {
  // TODO: Get form data and add a new record to DB
  db.favorites.create({name: req.body.name})
  .then(createdFave=>{
    console.log(createdFave)
    res.redirect('/pokemon')
    console.log(createdFave)
  })
  .catch(err=>{
    console.log("there is an error", err)
  })
});

// GET /pokemon - return a page with favorited Pokemon
app.get('/pokemon', function(req, res) {
  db.favorites.findAll()
  .then(favorites=>{
      res.render('faves', {favorites: favorites})
  })
  // TODO: Get all records from the DB and render to view
});

//show route
app.get('/:id', (req,res)=>{
  const pokemonUrl = `http://pokeapi.co/api/v2/pokemon/${req.params.id}`
  axios.get(pokemonUrl)
  .then(response=>{
    res.render('show', {pokemon: response.data})
    console.log(response.data)
  })
  .catch(err=>{
    console.log(err)
  })
})

// Imports all routes from the pokemon routes file
app.use('/pokemon', require('./routes/pokemon'));

const server = app.listen(port, function() {
  console.log('...listening on', port );
});

module.exports = server;
