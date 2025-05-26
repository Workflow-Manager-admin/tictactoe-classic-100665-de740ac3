import React, { useState } from 'react';
import './App.css';

// COLORS/THEME
const COLORS = {
  primary: '#ffffff',   // background/grid bg
  secondary: '#222222', // marks, grid border, (light text if bg is primary)
  accent: '#4caf50'     // win highlight, accent button
};

const GRID_SIZE = 5;                // 5x5 grid
const WIN_LENGTH = 3;               // 3-marks-in-a-row to win

// PUBLIC_INTERFACE
function App() {
  // State: board (flat array for simplicity), turn, status
  const [board, setBoard] = useState(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);              // true = X's turn, false = O's turn
  const [status, setStatus] = useState('playing');           // playing | win-X | win-O | draw
  const [winningLine, setWinningLine] = useState(null);      // array of cell indices if win

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (status !== 'playing' || board[idx]) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';

    // Detect outcome after move
    const { winner, line } = checkWin(newBoard, idx);
    if (winner) {
      setBoard(newBoard);
      setStatus(winner === 'X' ? 'win-X' : 'win-O');
      setWinningLine(line);
    } else if (newBoard.every(Boolean)) {
      setBoard(newBoard);
      setStatus('draw');
    } else {
      setBoard(newBoard);
      setXIsNext(!xIsNext);
    }
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(GRID_SIZE * GRID_SIZE).fill(null));
    setXIsNext(true);
    setStatus('playing');
    setWinningLine(null);
  }

  // Display status text
  let gameStatusText;
  if (status === 'playing') {
    gameStatusText = `Game in progress`;
  } else if (status === 'draw') {
    gameStatusText = `It's a draw!`;
  } else if (status === 'win-X') {
    gameStatusText = `Player X wins!`;
  } else if (status === 'win-O') {
    gameStatusText = `Player O wins!`;
  }

  // Player turn info
  const playerTurnText = status === 'playing'
    ? `Current turn: ${xIsNext ? 'X' : 'O'}`
    : `Game Over`;

  // PUBLIC_INTERFACE
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.primary,
      color: COLORS.secondary,
      fontFamily: 'Inter, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <nav style={{
        background: COLORS.secondary,
        color: COLORS.primary,
        padding: '18px 0',
        boxShadow: '0 1px 8px #0002',
        marginBottom: 0
      }}>
        <div style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>
            <span style={{ color: COLORS.accent, marginRight: 5 }}>■</span>
            TicTacToe Classic
          </span>
          <span style={{
            background: COLORS.primary,
            color: COLORS.secondary,
            padding: '3px 12px',
            fontSize: '0.92rem',
            borderRadius: 5,
            border: `1px solid ${COLORS.accent}`,
            fontWeight: 500,
            letterSpacing: 1
          }}>5x5 Mode</span>
        </div>
      </nav>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          minWidth: 320,
          margin: '0 auto',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 22,
            marginTop: 24
          }}>
            <div style={{
              fontWeight: 600,
              fontSize: 24,
              marginBottom: 4,
              letterSpacing: 1
            }}>
              {playerTurnText}
            </div>
          </div>

          {/* 5x5 Board */}
          <Board
            board={board}
            onCellClick={handleClick}
            winningLine={winningLine}
            disabled={status !== 'playing'}
            colors={COLORS}
          />

          {/* Status and restart */}
          <div style={{
            textAlign: 'center',
            marginTop: 25,
            marginBottom: 16
          }}>
            <div style={{
              fontSize: 18,
              fontWeight: 500,
              color: (status === 'draw')
                ? COLORS.secondary
                : (status === 'playing' ? COLORS.accent : COLORS.accent),
              minHeight: 28
            }}>
              {gameStatusText}
            </div>
            <button
              onClick={restartGame}
              style={{
                outline: 'none',
                background: COLORS.accent,
                color: COLORS.primary,
                border: 'none',
                borderRadius: 5,
                padding: '11px 30px',
                marginTop: 15,
                fontWeight: 600,
                fontSize: 17,
                letterSpacing: 1,
                cursor: 'pointer',
                boxShadow: status === 'playing' ? 'none' : '0 2px 12px #4caf5040',
                transition: 'filter .13s'
              }}
              tabIndex={0}
            >Restart</button>
          </div>
        </div>
      </main>
      <footer style={{
        textAlign: 'center',
        color: COLORS.secondary,
        fontSize: '0.96rem',
        opacity: 0.56,
        margin: '20px auto 10px'
      }}>
        <span>Classic rules: Get 3 in a row, column, or diagonal to win. 5x5 variant.</span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winningLine, disabled, colors }) {
  return (
    <div
      style={{
        width: 375,
        maxWidth: '98vw',
        margin: '0 auto',
        background: colors.primary,
        border: `2px solid ${colors.secondary}`,
        borderRadius: 10,
        padding: 11,
        display: 'grid',
        gap: 0,
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        boxShadow: `0 4px 34px #22222215`
      }}
    >
      {Array(GRID_SIZE * GRID_SIZE)
        .fill(0)
        .map((_, idx) => {
          const isWinCell = winningLine && winningLine.includes(idx);
          return (
            <Cell
              key={idx}
              value={board[idx]}
              onClick={() => onCellClick(idx)}
              highlight={isWinCell}
              disabled={disabled || !!board[idx]}
              colors={colors}
            />
          );
        })}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, onClick, highlight, disabled, colors }) {
  // neutral: white, .secondary border, .secondary text, .accent for highlight/win
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      style={{
        width: 56,
        height: 56,
        background: disabled && !highlight ? '#f6f6f9' : colors.primary,
        border: `2px solid ${highlight ? colors.accent : colors.secondary}`,
        borderRadius: 7,
        fontSize: 27,
        fontFamily: 'inherit',
        color: highlight ? colors.accent : colors.secondary,
        fontWeight: 700,
        outline: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        placeItems: 'center',
        transition: 'border-color .17s, color .17s, background .15s',
        boxShadow: highlight ? `0 0 8px 2px ${colors.accent}55` : 'none',
        cursor: disabled ? 'default' : 'pointer',
        userSelect: 'none'
      }}
      tabIndex={disabled ? -1 : 0}
      aria-label={"cell"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function checkWin(board, lastIdx) {
  // Returns {winner: "X"|"O"|null, line: [index,...]|null} for 3-in-row, checking from the last move.
  if (board[lastIdx] == null) return { winner: null, line: null };

  const curr = board[lastIdx];
  const row = Math.floor(lastIdx / GRID_SIZE);
  const col = lastIdx % GRID_SIZE;

  // directions: [dRow, dCol]. Each is a vector direction. Check 3-in-a-row for 4 directions.
  const directions = [
    [0, 1],   // horizontal (right)
    [1, 0],   // vertical (down)
    [1, 1],   // diagonal (down-right)
    [1, -1],  // diagonal (down-left)
  ];

  for (let [dr, dc] of directions) {
    // For each direction, try all starting points from (row - 2, col - 2) up to (row, col),
    // as long as they remain in bounds for a 3-in-row segment containing (row, col)
    for (let offset = - (WIN_LENGTH - 1); offset <= 0; ++offset) {
      let indices = [];
      for (let k = 0; k < WIN_LENGTH; ++k) {
        const r = row + dr * (offset + k);
        const c = col + dc * (offset + k);
        if (r < 0 || c < 0 || r >= GRID_SIZE || c >= GRID_SIZE) break;
        indices.push(r * GRID_SIZE + c);
      }
      if (indices.length === WIN_LENGTH &&
        indices.every(idx => board[idx] === curr)) {
        return { winner: curr, line: indices };
      }
    }
  }
  return { winner: null, line: null };
}

export default App;
