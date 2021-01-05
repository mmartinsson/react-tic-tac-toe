import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const winningSquares = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Square(props) {
    const highlight = props.highlight ? "square-highlight" : ""
    return (
      <button className={`square ${highlight}`} onClick={props.onClick}>
          {props.value}
      </button>
    )
}

class Board extends React.Component {
  renderSquare(squareIndex) {
    return <Square
      value={this.props.squares[squareIndex]}
      highlight={this.props.highlights.includes(squareIndex)}
      onClick={() => this.props.onClick(squareIndex)}
    />;
  }

  render() {
    const squares = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ]

    return (
      <div>
        {
          squares.map((row) => (
              <div className="board-row">
                {row.map(index => this.renderSquare(index))}
              </div>
          ))
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastSelectedIndex: null
      }],
      currentMoveNumber: 0,
      xIsNext: true
    }
  }

  handleClick(selectedIndex) {
    const history = this.state.history.slice(0, this.state.currentMoveNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if(winningPlayer(squares) || squares[selectedIndex]) {
      return
    }
    squares[selectedIndex] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSelectedIndex: selectedIndex
      }]),
      currentMoveNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpToAfter(targetMoveNumber) {
    this.setState({
      currentMoveNumber: targetMoveNumber,
      xIsNext: (targetMoveNumber % 2) === 0
    })
  }

  status(squares) {
    const winner = winningPlayer(squares)
    const numberOfMoves = squares.filter(Boolean).length
    const nextPlayer = numberOfMoves % 2 ? 'O' : 'X'

    if(winner) {
      return `Player ${winner} won!`
    } else if(numberOfMoves === 9) {
      return 'The match was a draw'
    } else {
      return `Next player: ${nextPlayer}`
    }
  }

  historyMoves(history) {
    return history.slice(1).map((historyBoard, historyMoveIndex) => {
      const historyMoveNumber = historyMoveIndex + 1
      const player = historyMoveNumber % 2 ? 'X' : 'O'
      const column = (historyBoard.lastSelectedIndex % 3) + 1
      const row = Math.floor(historyBoard.lastSelectedIndex / 3) + 1
      const className = historyMoveNumber === this.state.currentMoveNumber ? "selected" : "not-selected"

      return (
          <li className={className} key={historyMoveNumber}>
            <div>Player {player} selected column {column} row {row}</div>
            <button
                className="history-button"
                onClick={() => this.jumpToAfter(historyMoveNumber)}>{'Go to this move'}
            </button>
          </li>
      )
    })
  }

  render() {
    const currentBoard = this.state.history[this.state.currentMoveNumber]

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentBoard.squares}
            onClick={(i) => this.handleClick(i)}
            highlights={winningRow(currentBoard.squares)}
          />
        </div>
        <div className="game-info">
          <div className="status">{this.status(currentBoard.squares)}</div>
          <button onClick={() => this.jumpToAfter(0)}>Go to game start</button>
          <ol>{this.historyMoves(this.state.history)}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function winningPlayer(squares) {
  for (let i = 0; i < winningSquares.length; i++) {
    const [a, b, c] = winningSquares[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function winningRow(squares) {
  for (let i = 0; i < winningSquares.length; i++) {
    const [a, b, c] = winningSquares[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return winningSquares[i];
    }
  }
  return [];
}
