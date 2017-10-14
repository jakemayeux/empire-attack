var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var shortid = require('shortid')

var games = []

class Game {
  constructor(){
    this.width = 100
    this.height = 100
    this.map = new Array()
    this.id = shortid.generate()
    this.maxPlayers = 30
    this.players = 0
    for(let x = 0; x < this.width; x++){
      console.log(x)
      this.map[x] = new Array()
      for(let y = 0; y < this.width; y++){
        this.map[x][y] = new Tile()
      }
    }
  }

  addPlayer(socket){
    console.log('adding ' + socket.id + ' to game ' + game.id)
    socket.emit('test', 'asdf')
  }
}

const TILE = {
  CITY: 'city',
  COIN: 'coin',
  ROCK: 'rock',
  WATER: 'water',
  BLANK: 'blank'
}

class Tile {
  constructor(){ // random terrain object
    let rand = Math.random()
    if(rand < .7){
      this.type = TILE.BLANK
    }else if(rand < .9){
      this.type = TILE.ROCK
    }else{
      this.type = TILE.WATER
    }
  }
}

class Player {
  constructor(){}
}

games.push(new Game())

app.get('/*', function(req, res){
  res.sendFile(__dirname + '/' + req.path)
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})

io.on('connection', function(socket){
  for(game of games){
    if(game.players < game.maxPlayers){
      game.addPlayer(socket)
    }
  }
})

function update(){
  for(game of games){

  }
}
setInterval(update, 50)
