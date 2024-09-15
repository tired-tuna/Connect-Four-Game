class Player {
  constructor(color) {
    this.color = color;
  }
}

class ConnectFour {
  constructor(player1, player2, width = 7, height = 6) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.players = [player1, player2];
    this.currPlayer = player1;
    this.board = [];
    this.gameOver = false;
    this.makeHtmlBoard();
  }

  makeBoard() {
    this.board = Array.from({ length: this.HEIGHT }, () => Array(this.WIDTH).fill(null));
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    if (!board) {
      console.error("Board element not found");
      return;
    }
    board.innerHTML = ''; // Clear the board

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));
    for (let x = 0; x < this.WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", x);
      top.append(cell);
    }
    board.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) if (!this.board[y][x]) return y;
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
    document.getElementById(`${y}-${x}`).append(piece);
  }

  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }

  handleClick(evt) {
    if (this.gameOver) return;

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) return;
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    if (this.checkForWin()) return this.endGame(`Player ${this.currPlayer.color} won!`);
    if (this.board.every(row => row.every(cell => cell))) return this.endGame("Tie!");
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  checkForWin() {
    const directions = [
      [[0, 1], [0, 2], [0, 3]], // horizontal
      [[1, 0], [2, 0], [3, 0]], // vertical
      [[1, 1], [2, 2], [3, 3]], // diagonal down-right
      [[1, -1], [2, -2], [3, -3]] // diagonal down-left
    ];

    const _win = cells => cells.every(([y, x]) => y >= 0 && y < this.HEIGHT && x >= 0 && x < this.WIDTH && this.board[y][x] === this.currPlayer);

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        if (directions.some(dir => _win([[y, x], ...dir.map(([dy, dx]) => [y + dy, x + dx])]))) {
          return true;
        }
      }
    }
    return false;
  }

  startGame() {
    this.currPlayer = this.players[0];
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

document.getElementById("start-button").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default form submission
  const player1Color = document.getElementById("player1-color").value;
  const player2Color = document.getElementById("player2-color").value;
  const player1 = new Player(player1Color);
  const player2 = new Player(player2Color);
  const game = new ConnectFour(player1, player2);
  game.startGame();
});