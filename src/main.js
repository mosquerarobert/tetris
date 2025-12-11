import './style.css'

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const $score = document.querySelector('span');

const blockSize = 20;
const boardWidth = 14;
const boardHeight = 30;

let score = 0;

canvas.width = blockSize * boardWidth;
canvas.height = blockSize * boardHeight;

context.scale(blockSize, blockSize);

const board = createBoard(boardHeight, boardWidth);

function createBoard(height, width){
  return Array(height).fill().map(() => Array(width).fill(0))
}

const piece = {
  position: { x: 5, y: 5},
  shape: [
    [1,1],
    [1,1],
  ]
}

const pieces = [
  [
    [1,1],
    [1,1]
  ],
  [
    [1,1,0],
    [0,1,1]
  ],
  [
    [0,1,1],
    [1,1,0]
  ],
  [
    [0,1,0],
    [1,1,1]
  ],
  [
    [1,0],
    [1,0],
    [1,1]
  ],
  [
    [0,1],
    [0,1],
    [1,1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ],
]

let dropCounter = 0
let lastTime = 0

function moveDown(piece){
    piece.position.y++;
    if(checkCollision()){
      piece.position.y--;
      solidify();
    }
}

function update(time = 0){
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if(dropCounter > 1000){
    moveDown(piece)
    dropCounter = 0
  }
  
  draw();
  window.requestAnimationFrame(update);
}

function draw(){
  context.fillStyle = 'black'
  context.fillRect(0,0,boardWidth, boardHeight);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1){
        context.fillStyle = 'cyan';
        context.fillRect(x, y, 1, 1);
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value){
        context.fillStyle = 'lavender';
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    })
  })
}

document.addEventListener('keydown', event => { 
  if(event.key === 'ArrowDown'){
    moveDown(piece)
  }

  if(event.key === 'ArrowLeft'){
    piece.position.x--;
    if(checkCollision()){
      piece.position.x++;
    }
  }

  if(event.key === 'ArrowRight'){
    piece.position.x++;
    if(checkCollision()){
      piece.position.x--;
    }
  }

  if(event.key === 'ArrowUp'){
    const rotatedPiece = [];

    for(let i = 0; i < piece.shape[0].length; i++){
      const row = [];

      for(let j = piece.shape.length - 1; j >= 0; j--){
        row.push(piece.shape[j][i])
      }
      rotatedPiece.push(row)
    }
    const previous = piece.shape
    piece.shape = rotatedPiece;

    if(checkCollision()){
      piece.shape = previous;
    }
  }

});

function checkCollision(){
  return piece.shape.find((row, y) => {
    return row.find((value, x) =>{
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min) 
}

function solidify(){
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) =>{
       if(value === 1){
        board[y + piece.position.y][x + piece.position.x] = 1;
       }
    })
  })

  killLine()

  piece.shape = pieces[Math.floor(Math.random() * pieces.length)]

  piece.position.x = getRandomInRange(2, (boardWidth - 4))
  piece.position.y = 0

  if(checkCollision()){
    alert('Game over yo!')
    board.forEach(row => row.fill(0))
  }

  $score.innerText = score;
}

function killLine(){
  const linesToKill = []

  board.forEach((row, y) => {
   if(row.every(value => value === 1))
    linesToKill.push(y)
  })

  linesToKill.forEach(y => {
    board.splice(y, 1);
    const newLine = Array(boardWidth).fill(0);
    board.unshift(newLine);
    score += 10;
  })
}

update();




