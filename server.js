var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var shortid = require('shortid')

var games = []

class Game {
  constructor(){
    this.width = 100
    this.height = 100
    this.map = [] 
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
	  this.genLake(1)
  }
	
	genMoutain(i){
		if(i<1) return
		
		let changes = []
		for(let x = 0; x < this.
	}

  genLake(i){
	  if(i<1) return

	  let changes = []
    for(let x = 0; x < this.width; x++){
		  for(let y = 0; y < this.width; y++){
				let wn = 0;
				for(let t of this.getNeighbors(x,y)){
					if(t.type == TILE.LAKE) wn++
				}

				let rand = Math.random() * wm
				if(rand > .3){
					changes.push({x:x,y:y})
				}
	    }
	  }
		for(let t of changes){
			this.map[t.x][t.y].type = TILE.LAKE
		}
	}
		

	getNeighbors(x,y){
		let ret = []
		if(x > 0) ret.push(this.map[x-1][y])
		if(y > 0) ret.push(this.map[x][y-1])
		if(x < this.width - 1) ret.push(this.map[x+1][y])
		if(y < this.height - 1) ret.push(this.map[x][y+1])
		return ret
	}

	addPlayer(socket){
  	console.log('adding ' + socket.id + ' to game ' + game.id)
  	socket.emit('test', 'asdf')
		socket.emit('map', this.map)
  }
}

const TILE = {
  CITY: 'city',
  COIN: 'coin',
  ROCK: 'rock',
  RIVER: 'river',
  LAKE: 'lake',
  BLANK: 'blank'
}

class Tile {
  constructor(){ // random terrain object
    let rand = Math.random()
    this.type = TILE.BLANK
    if(rand < .05) this.type = TILE.ROCK
    if(rand < .1) this.type = TILE.LAKE
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
