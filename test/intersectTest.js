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
  it("intersection of lists [] and ['milk', 'egg'] should return []",function(){
    let result = server.intersectOfLists([[],['milk','egg']]);
    expect(result).to.eql([])
  })
  it("intersection of lists ['chicken'] and ['milk', 'egg'] should return []",function(){
    let result = server.intersectOfLists([['chicken'],['milk','egg']]);
    expect(result).to.eql([])
  })
  it("intersection of lists ['milk', 'egg'] and ['milk', 'egg'] should return ['milk', 'egg']",function(){
    let result = server.intersectOfLists([['milk', 'egg'],['milk','egg']]);
    expect(result).to.eql(['milk', 'egg'])
  })
  it("intersection of lists [] and [] should return []",function(){
    let result = server.intersectOfLists([[],[]]);
    expect(result).to.eql([])
  })
})
