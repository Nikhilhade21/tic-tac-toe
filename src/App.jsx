import Player from "./components/Player"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"
import { useState } from "react";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-cominations.js"

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
}

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';
  
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O'
  }
  return currentPlayer
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;

      gameBoard[row][col] = player;
  }
  return gameBoard;
}

function deriveWinner (gameBoard, players) {
  let winner;

  for (const comination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =  gameBoard[comination[0].row][comination[0].column]
    const secondSquareSymbol = gameBoard[comination[1].row][comination[1].column]
    const thirdSquareSymbol =  gameBoard[comination[2].row][comination[2].column]

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([]);
  
  const activePlayer = deriveActivePlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && ! winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        {square: {row: rowIndex, col: colIndex}, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prePlayers => {
      return {
        ...prePlayers,
        [symbol] : newName
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player 
            initailName={PLAYERS.X} 
            symbol='X' 
            isActive={activePlayer ==='X'} 
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            initailName={PLAYERS.O} 
            symbol='O' 
            isActive={activePlayer ==='O'} 
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) &&  <GameOver winner={winner} restart={handleRestart} />}
        <GameBoard onSelectSquare={handleSelectSquare} board = {gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
 