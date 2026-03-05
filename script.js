const boardElement = document.getElementById('board');
const currentPlayerElement = document.getElementById('current-player');
const diceValueElement = document.getElementById('dice-value');
const playerStatusElement = document.getElementById('player-status');
const messageElement = document.getElementById('message');
const rollButton = document.getElementById('roll-btn');
const resetButton = document.getElementById('reset-btn');

const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

const players = [
  { name: 'Player 1', position: 0, tokenClass: 'p1' },
  { name: 'Player 2', position: 0, tokenClass: 'p2' },
];

let activePlayer = 0;
let gameOver = false;

function boardOrder() {
  const order = [];
  for (let row = 9; row >= 0; row--) {
    const start = row * 10 + 1;
    const nums = Array.from({ length: 10 }, (_, index) => start + index);
    if ((9 - row) % 2 === 1) {
      nums.reverse();
    }
    order.push(...nums);
  }
  return order;
}

function createBoard() {
  boardElement.innerHTML = '';
  for (const cellNumber of boardOrder()) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.value = String(cellNumber);

    const number = document.createElement('span');
    number.className = 'cell-number';
    number.textContent = String(cellNumber);
    cell.appendChild(number);

    if (snakes[cellNumber]) {
      const tag = document.createElement('span');
      tag.className = 'tag snake';
      tag.textContent = `↓ ${snakes[cellNumber]}`;
      cell.appendChild(tag);
    }

    if (ladders[cellNumber]) {
      const tag = document.createElement('span');
      tag.className = 'tag ladder';
      tag.textContent = `↑ ${ladders[cellNumber]}`;
      cell.appendChild(tag);
    }

    const tokens = document.createElement('div');
    tokens.className = 'tokens';
    cell.appendChild(tokens);

    boardElement.appendChild(cell);
  }
}

function renderPlayers() {
  document.querySelectorAll('.tokens').forEach((tokenContainer) => {
    tokenContainer.innerHTML = '';
  });

  players.forEach((player, index) => {
    const target = player.position === 0 ? 1 : player.position;
    const cell = boardElement.querySelector(`[data-value="${target}"] .tokens`);
    const token = document.createElement('span');
    token.className = `token ${player.tokenClass}`;
    token.title = player.name;
    cell.appendChild(token);

    const li = document.createElement('li');
    li.textContent = `${player.name}: ${player.position}`;
    if (index === activePlayer && !gameOver) {
      li.style.fontWeight = '700';
    }
    playerStatusElement.appendChild(li);
  });
}

function updateUI(message) {
  playerStatusElement.innerHTML = '';
  renderPlayers();
  currentPlayerElement.textContent = players[activePlayer].name;
  messageElement.textContent = message;
}

function rollDice() {
  if (gameOver) {
    return;
  }

  const roll = Math.floor(Math.random() * 6) + 1;
  const player = players[activePlayer];
  diceValueElement.textContent = String(roll);

  let nextPosition = player.position + roll;
  let message = `${player.name} rolled ${roll}. `;

  if (nextPosition > 100) {
    message += 'Needs exact roll to finish.';
  } else {
    player.position = nextPosition;

    if (snakes[nextPosition]) {
      player.position = snakes[nextPosition];
      message += `Oh no! Snake down to ${player.position}.`;
    } else if (ladders[nextPosition]) {
      player.position = ladders[nextPosition];
      message += `Great! Ladder up to ${player.position}.`;
    }
  }

  if (player.position === 100) {
    message = `${player.name} wins the game! 🎉`;
    gameOver = true;
    rollButton.disabled = true;
  } else {
    activePlayer = (activePlayer + 1) % players.length;
  }

  updateUI(message);
}

function resetGame() {
  players.forEach((player) => {
    player.position = 0;
  });
  activePlayer = 0;
  gameOver = false;
  diceValueElement.textContent = '-';
  rollButton.disabled = false;
  updateUI('Game reset. Player 1 starts!');
}

rollButton.addEventListener('click', rollDice);
resetButton.addEventListener('click', resetGame);

createBoard();
updateUI('Click "Roll Dice" to start.');
