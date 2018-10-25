const express = require('express')
const app = express()
const http = require('http').Server(app)
const assert  = require('chai').assert;
const expect  = require('chai').expect;
const Server = require('../server/server.js')

// Serve the public folder statically
app.use(express.static('../public'))
// http.listen(3000, () => console.log('Listening on port 3000...'))

// Launch server instance
let server = new Server(http)
describe('Intersection of Lists',function(){
    it("intersection of lists ['milk'] and ['milk', 'egg'] should return ['milk']",function(){
      let result = server.intersectOfLists([['milk'],['milk','egg']]);
      expect(result).to.eql(['milk'])
    })
})
