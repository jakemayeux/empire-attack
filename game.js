var socket = io()
var can = document.querySelector('canvas')
var ctx = can.getContext('2d')

map = []
scale = 10;
offset = {x:0, y:0}

window.onresize =()=> {
  can.width = window.innerWidth
  can.height = window.innerHeight
}
window.onresize()

socket.on('test', (e) => {
  console.log(e)
})

socket.on('map', (m) => {
  window.map = m
  console.log(m)
  drawMap()
})

//for(x=0;x<100;x++){
//  map[x] = []
//  for(y=0;y<100;y++){
//    map[x][y] = {type:'lake'}
//  }
//}

//drawMap()

function drawMap(){
  if(!map) return
  for(let x = 0; x < map.length; x++){
    for(let y = 0; y < map[0].length; y++){
      drawTile(x, y, map[x][y])
    }
  }
}

function drawTile(x, y, tile){
  x = x*scale + offset.x*scale
  y = y*scale + offset.y*scale
  ctx.beginPath()
  if(tile.type == 'lake'){
    ctx.fillStyle = '#0000ff'
  }else{
    ctx.fillStyle = '#eeeeee'
  }
  ctx.arc(x, y, scale/2, 0, Math.PI*2)
  ctx.fill()
}
