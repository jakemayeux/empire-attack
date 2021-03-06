var socket = io()
var can = document.querySelector('canvas')
var ctx = can.getContext('2d')

map = []
mapWidth = 0
mapHeight = 0

cache = []

scale = 20;
offset = {x:0, y:0}
mouse = {
  x:-1,y:-1,
  lx:-1,ly:-1,
  cx:-1,cy:-1,
  tx:0,ty:0,
  ltx:0,lty:0,
  pan:false,
  down:false,
}

var getPixelRatio = function(context) {
    var backingStore = context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
}
pixRatio = getPixelRatio(ctx)
console.log(pixRatio)

window.onresize =()=> {
  can.width = window.innerWidth*pixRatio
  can.height = window.innerHeight*pixRatio
  can.style.width = window.innerWidth + 'px'
  can.style.height = window.innerHeight + 'px'
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
  console.log('done')
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
	if(tile.type == 'lake'){
		ctx.fillStyle = '#0000ff'
	}else if(tile.type == 'rock'){
		ctx.fillStyle = '#222222'
	}else{
		ctx.fillStyle = '#eeeeee'
	}
	color = ctx.fillStyle
	id = ''+color 
	if(cache[id] && true){
		ctx.putImageData(cache[id], (x-scale/2)*pixRatio, (y-scale/2)*pixRatio)
	}else{
		ctx.beginPath()
		ctx.arc(x, y, scale/2, 0, Math.PI*2)
		ctx.fill()
		if(x*pixRatio > scale*pixRatio && 
			y*pixRatio > scale*pixRatio && 
			x*pixRatio < can.width-scale*pixRatio && 
			y*pixRatio < can.height-scale*pixRatio){
			setCache(x,y,id)
		}
	}
}

function setCache(x, y, id){
	cache[id] = 
		ctx.getImageData(
		(x-scale/2)*pixRatio, (y-scale/2)*pixRatio, 
		scale*pixRatio, scale*pixRatio)
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
  ctx.arc(x, y, scale/2-2, 0, Math.PI*2)
  ctx.stroke()
}

function dist(x1, y1, x2, y2){
  return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))
}

function drawBorders(x, y, borders){
	ctx.beginPath()
	if(borders.compass.substr(0,2) == 'NS' || borders.compass.substr(-2,2) == 'WE'){
		ctx.fillRect(x-this.scale/2, y-this.scale/2, this.scale, this.scale)
		return false
	}
	ctx.lineWidth = this.scale
	for(i of borders.arrv){
		ctx.moveTo(x, y)
		ctx.lineTo(x+(i.x*this.scale/2), y+(i.y*this.scale/2))
	}
	ctx.stroke()
	return true
}

function getLikeBorders(x, y){
	let ret = ''
	
	for(i of getNeighborCompass(x, y)){
		if(map[x][y].type == i.tile.type){
			ret += i.dir
		}
	}
	return ret
}

function getNeighborCompass(x,y){
	let ret = new Array()
	if(map[x][y-1]){
		ret.push({dir: 'N', tile: map[x][y-1]})
	}
	if(map[x][y+1]){
		ret.push({dir: 'S', tile: map[x][y+1]})
	}
	if(map[x-1]){
		ret.push({dir: 'W', tile: map[x-1][y]})
	}
	if(map[x+1]){
		ret.push({dir: 'E', tile: map[x+1][y]})
	}
	return ret
}

window.onmousedown =(e)=> {
  mouse.down = true
  mouse.cx = e.clientX
  mouse.cy = e.clientY
}

window.onmouseup =(e)=> {
  mouse.down = false
  mouse.pan = false
}

window.onmousemove =(e)=> {
  mouse.lx = mouse.x
  mouse.ly = mouse.y
  mouse.x = e.clientX
  mouse.y = e.clientY
  let tx = Math.round(mouse.x/scale - offset.x/scale)
  let ty = Math.round(mouse.y/scale - offset.y/scale)
  if(tx > -1 && tx < mapWidth && ty > -1 && ty < mapHeight && !mouse.pan){
    mouse.ltx = mouse.tx
    mouse.lty = mouse.ty
    mouse.tx = tx
    mouse.ty = ty
  }

  if(mouse.down && dist(mouse.cx,mouse.cy,mouse.x,mouse.y) > 5){
    mouse.pan = true
  }

  if(mouse.pan){
    offset.x += mouse.x - mouse.lx
    offset.y += mouse.y- mouse.ly
    ctx.clearRect(0,0,can.width,can.height)
    drawMap()
  }

  drawCursor(mouse.x, mouse.y)
}
