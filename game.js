var socket = io()
var can = document.querySelector('canvas')
var ctx = can.getContext('2d')

map = []
mapWidth = 0
mapHeight = 0

scale = 10;
offset = {x:5, y:0}
mouse = {
  x:-1,y:-1,
  tx:0,ty:0,
  ltx:0,lty:0
}

window.onresize =()=> {
  can.width = window.innerWidth
  can.height = window.innerHeight
  drawMap()
}
window.onresize()

socket.on('test', (e) => {
  console.log(e)
})

socket.on('map', (m) => {
  window.map = m
  mapWidth = m.length
  mapHeight = m[0].length
  drawMap()
})

function drawMap(){
  if(!map) return
  for(let x = 0; x < map.length; x++){
    for(let y = 0; y < map[0].length; y++){
      drawTile(x, y, map[x][y])
    }
  }
}

function drawTile(x, y, tile){
  clearTile(x, y)
  x = x*scale + offset.x
  y = y*scale + offset.y
  ctx.beginPath()
  if(tile.type == 'lake'){
    ctx.fillStyle = '#0000ff'
  }else if(tile.type == 'rock'){
    ctx.fillStyle = '#222222'
  }else{
    ctx.fillStyle = '#eeeeee'
  }
  ctx.arc(x, y, scale/2, 0, Math.PI*2)
  ctx.fill()
}

function clearTile(x, y){
  x = x*scale + offset.x
  y = y*scale + offset.y
  ctx.clearRect(x-scale/2,y-scale/2,scale,scale)
}

function drawCursor(x, y){
  x = mouse.tx
  y = mouse.ty
  drawTile(x, y, map[x][y])
  drawTile(mouse.ltx, mouse.lty, map[mouse.ltx][mouse.lty])
  x = x*scale + offset.x
  y = y*scale + offset.y
  ctx.beginPath()
  ctx.strokeStyle = '#222222'
  ctx.arc(x, y, scale/2, 0, Math.PI*2)
  ctx.stroke()
}

function toTilePos(x, y){
  let ret = {}
  ret.x = x/scale + offset.x
  ret.y = y/scale + offset.y
  return ret
}

window.onmousedown =(e)=> {
  console.log(e)
}

window.onmouseup =(e)=> {
  console.log(e)
}

window.onmousemove =(e)=> {
  mouse.x = e.clientX
  mouse.y = e.clientY
  let tx = Math.round(mouse.x/scale)
  let ty = Math.round(mouse.y/scale)
  if(tx > 0 && tx < mapWidth && ty > 0 && ty < mapHeight){
    mouse.ltx = mouse.tx
    mouse.lty = mouse.ty
    mouse.tx = tx
    mouse.ty = ty
  }
  drawCursor(mouse.x, mouse.y)
}
