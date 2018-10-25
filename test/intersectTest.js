const express = require('express')
const app = express()
const http = require('http').Server(app)
const Server = require('../server/server.js')
const expect  = require('chai').expect;
let server = new Server(http)

describe('Intersection of Lists',function(){
  it("intersection of lists ['milk'] and ['milk', 'egg'] should return ['milk']",function(){
    let result = server.intersectOfLists([['milk'],['milk','egg']]);
    expect(result).to.eql(['milk'])
  })
})
