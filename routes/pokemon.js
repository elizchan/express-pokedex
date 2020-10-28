require('dotenv').config();
const express = require('express');
const router = express.Router();

const axios = require('axios'); 
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const db = require('../models')

app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'))


// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
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
router.get('/', function(req, res) {
  db.favorites.findAll()
  .then(favorites=>{
      res.render('faves', {favorites: favorites})
  })
  // TODO: Get all records from the DB and render to view
});

//show route
router.get('/:id', (req,res)=>{
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

module.exports = router;
