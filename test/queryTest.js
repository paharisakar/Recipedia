const express = require('express')
const app = express()
const http = require('http').Server(app)
const Server = require('../server/server.js')
const assert = require('chai').assert
let server = new Server(http)

describe('Mapping Query', () => {
    it(`mapping query for 'honey' should return 'select recipe from ingredientMapping where ingredient = "honey"'`, () => {
        assert.equal(server.queryRecipesFromIngredient('honey'), `select recipe from ingredientMapping where ingredient = "honey"`)
    })
    it(`mapping query for 'soy sauce' should return 'select recipe from ingredientMapping where ingredient = "soy sauce"'`, () => {
        assert.equal(server.queryRecipesFromIngredient('soy sauce'), `select recipe from ingredientMapping where ingredient = "soy sauce"`)
    })
    it(`mapping query for 'chicken' should return 'select recipe from ingredientMapping where ingredient = "chicken"'`, () => {
        assert.equal(server.queryRecipesFromIngredient('chicken'), `select recipe from ingredientMapping where ingredient = "chicken"`)
    })
})

describe('Recipe details selecting Query', () => {
    it(`Recipe details query for recipe 'Apple Puff Pancake' should return 'select * from recipeUrl where recipeName = "Apple Puff Pancake"`, () => {
        assert.equal(server.queryDetailsFromRecipe('Apple Puff Pancake'), `select * from recipeUrl where recipeName = "Apple Puff Pancake"`)
    })
    it(`Recipe details query for recipe 'Breakfast Pies' should return 'select * from recipeUrl where recipeName = "Breakfast Pies"`, () => {
        assert.equal(server.queryDetailsFromRecipe('Breakfast Pies'), `select * from recipeUrl where recipeName = "Breakfast Pies"`)
    })
    it(`Recipe details query for recipe 'Alyson\'s Broccoli Salad' should return 'select * from recipeUrl where recipeName = "Alyson\'s Broccoli Salad"`, () => {
        assert.equal(server.queryDetailsFromRecipe('Alyson\'s Broccoli Salad'), `select * from recipeUrl where recipeName = "Alyson\'s Broccoli Salad"`)
    })
})

describe('All Ingredients selecting Query', () => {
    it(`query for all ingredients should return 'select ingredient from ingredientMapping'`, () => {
        assert.equal(server.queryAllIngredients(), `select ingredient from ingredientMapping`)
    })
})
describe('Recipe phrase searching Query ', () => {
    it(`phrase searching query for input word 'soup' should return 'select * from recipeUrl where recipeName like '%soup%'`, () => {
        assert.equal(server.queryRecipesLikePhrase('soup'), `select * from recipeUrl where recipeName like '%soup%'`)
    })
    it(`phrase searching query for input word 'pizza' should return 'select * from recipeUrl where recipeName like '%pizza%'`, () => {
        assert.equal(server.queryRecipesLikePhrase('pizza'), `select * from recipeUrl where recipeName like '%pizza%'`)
    })
    it(`phrase searching query for input word 'salad' should return 'select * from recipeUrl where recipeName like '%salad%'`, () => {
        assert.equal(server.queryRecipesLikePhrase('salad'), `select * from recipeUrl where recipeName like '%salad%'`)
    })
})
