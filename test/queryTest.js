const express = require('express')
const app = express()
const http = require('http').Server(app)
const Server = require('../server/server.js')
const assert = require('chai').assert
let server = new Server(http)

describe('Mapping Query', () => {
    it(`mapping query for 'honey' should return 'select recipe from ingredientMapping where ingredient = "honey"'`, () => {
        assert.equal(server.mappingQuery('honey'), `select recipe from ingredientMapping where ingredient = "honey"`)
    })

    it(`mapping query for 'soy sauce' should return 'select recipe from ingredientMapping where ingredient = "soy sauce"'`, () => {
        assert.equal(server.mappingQuery('soy sauce'), `select recipe from ingredientMapping where ingredient = "soy sauce"`)
    })
})

describe('Instructions Query', () => {
    it(`instructions query for 'chicken alfredo' should return 'select instructions from instruction where Dish = "chicken alfredo"'`, () => {
        assert.equal(server.instructionsQuery('chicken alfredo'), `select instructions from instruction where Dish = "chicken alfredo"`)
    })
})