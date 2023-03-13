const O_PLAYER = "O";
const X_PLAYER = "X";

let currentPlayer;
const currentPlayerContainer = document.getElementById('current-player');
const currentPlayerSymbol = document.getElementById('current-player__symbol');
const gameboardHtml = document.getElementById('gameboard');
const restartBtn = document.getElementById('restartBtn');
const winnerName = document.getElementById('winner-name');

let gameboardArray = [];
let winningCoordsHorizontal = [];
let winningCoordsVertical = [];
let winningCoordsDiagonal = [];

let gameEnded = false;

// TODO: Check for a draw
function boxClicked(e) {
    let box = e.target;
    let col = box.getAttribute('data-col');
    let row = box.getAttribute('data-row');

    if (!gameboardArray[row][col] && !gameEnded) {
        gameboardArray[row][col] = currentPlayer;

        box.innerText = currentPlayer;

        if (checkWin(currentPlayer, gameboardArray)) {
            gameEnded = true;
        }

        currentPlayer = currentPlayer == X_PLAYER ? O_PLAYER : X_PLAYER;
        currentPlayerSymbol.innerText = currentPlayer;
    }
}

function restart() {
    const boxes = Array.from(document.getElementsByClassName('box'));

    currentPlayerContainer.style.display = 'block';
    winnerName.style.display = 'none';

    boxes.forEach(box => {
        box.classList.remove("selected");
        box.innerText = "";
    });

    // Clear the content of the arrays
    gameboardArray = [];
    winningCoordsHorizontal = [];
    winningCoordsVertical = [];
    winningCoordsDiagonal = [];

    // Recreate board 
    for (let row = 0; row < 10; row++) {
        gameboardArray[row] = [];

        for (let col = 0; col < 10; col++) {
            gameboardArray[row][col] = null;
        }
    }

    showPlayerSymbol();
    gameEnded = false;
}

function checkWin(player, board) {
    // Check for horizontal win
    for (let row = 0; row < 10; row++) {
        let count = 0;
        for (let col = 0; col < 10; col++) {
            if (board[row][col] == player) {
                count++;
                winningCoordsHorizontal.push([row, col]);

                if (count === 4) {
                    currentPlayerContainer.style.display = 'none';
                    winnerName.style.display = 'block';
                    winnerName.innerText = `Player ${player} has won!`;

                    markWinningCoords(winningCoordsHorizontal);

                    return true;
                }
            } else {
                count = 0;
                winningCoordsHorizontal = [];
            }
        }
    }

    // Check for vertical win
    for (let col = 0; col < 10; col++) {
        let count = 0;
        for (let row = 0; row < 10; row++) {
            if (board[row][col] == player) {
                count++;
                winningCoordsVertical.push([row, col]);

                if (count === 4) {
                    currentPlayerContainer.style.display = 'none';
                    winnerName.style.display = 'block';
                    winnerName.innerText = `Player ${player} has won!`;

                    markWinningCoords(winningCoordsVertical);

                    return true;
                }
            } else {
                count = 0;
                winningCoordsVertical = [];
            }
        }
    }

    // Check for diagonal win (top-left to bottom-right)
    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            if (
                board[row][col] == player &&
                board[row + 1][col + 1] == player &&
                board[row + 2][col + 2] == player &&
                board[row + 3][col + 3] == player
            ) {
                currentPlayerContainer.style.display = 'none';
                winnerName.style.display = 'block';
                winnerName.innerText = `Player ${player} has won!`;

                winningCoordsDiagonal.push([row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]);
                markWinningCoords(winningCoordsDiagonal);

                return true;
            }
        }
    }

    // Check for diagonal win (top-right to bottom-left)
    for (let row = 0; row < 7; row++) {
        for (let col = 3; col < 10; col++) {
            if (
                board[row][col] === player &&
                board[row + 1][col - 1] === player &&
                board[row + 2][col - 2] === player &&
                board[row + 3][col - 3] === player
            ) {
                currentPlayerContainer.style.display = 'none';
                winnerName.style.display = 'block';
                winnerName.innerText = `Player ${player} has won!`;

                winningCoordsDiagonal.push([row, col], [row + 1, col - 1], [row + 2, col - 2], [row + 3, col - 3]);
                markWinningCoords(winningCoordsDiagonal);

                return true;
            }
        }
    }

    // No win
    return false;
};

function markWinningCoords(array) {
    array.forEach(function (element) {
        document.querySelector('[data-col="' + element[1] + '"][data-row="' + element[0] + '"]').classList.add("selected");
    });
}

function showPlayerSymbol() {
    const currentPlayerSymbolElement = document.getElementById('current-player__symbol');
    const symbols = ['X', 'O'];
    let count = 0;

    const interval = setInterval(() => {
        currentPlayerSymbolElement.textContent = symbols[count];
        count++;
        if (count >= symbols.length) {
            count = 0;
        }
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * symbols.length);
        const randomSymbol = symbols[randomIndex];
        currentPlayerSymbolElement.textContent = randomSymbol;

        currentPlayer = randomSymbol;
    }, 500);
}

function ready() {
    // Create board 
    for (let row = 0; row < 10; row++) {
        gameboardArray[row] = [];

        for (let col = 0; col < 10; col++) {
            gameboardArray[row][col] = null;

            let div = document.createElement('div');
            div.classList.add("box");
            div.setAttribute('data-col', col);
            div.setAttribute('data-row', row);

            div.addEventListener('click', boxClicked);
            gameboardHtml.appendChild(div);
        }
    }

    restartBtn.addEventListener('click', restart);
    showPlayerSymbol();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

