import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
          {props.value}
      </button>
    )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
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
      moveNumber: 0,
      xIsNext: true
    }
  }

  handleClick(selectedIndex) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if(calculateWinner(squares) || squares[selectedIndex]) {
      return
    }
    squares[selectedIndex] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSelectedIndex: selectedIndex
      }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpToAfter(moveNumber) {
    this.setState({
      moveNumber: moveNumber,
      xIsNext: (moveNumber % 2) === 0
    })
  }

  status(squares) {
    const winner = calculateWinner(squares)
    const moveNumber = squares.filter(Boolean).length
    const nextPlayer = moveNumber % 2 ? 'O' : 'X'

    if(winner) {
      return `Player ${winner} won!`
    } else if(moveNumber === 9) {
      return 'The match was a draw'
    } else {
      return `Next player: ${nextPlayer}`
    }
  }

  render() {
    const history = this.state.history
    const current = history[this.state.moveNumber]

    const moves = history.slice(1).map((board, moveIndex) => {
      const moveNumber = moveIndex + 1
      const player = moveNumber % 2 ? 'X' : 'O'
      const column = (board.lastSelectedIndex % 3) + 1
      const row = Math.floor(board.lastSelectedIndex / 3) + 1
      const className = moveIndex === this.state.moveNumber-1 ? "selected" : "not-selected"

      return (
        <li className={className} key={moveNumber}>
          <div>Player {player} selected column {column} row {row}</div>
          <button
              className="history-button"
              onClick={() => this.jumpToAfter(moveNumber)}>{'Go to this move'}
          </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{this.status(current.squares)}</div>
          <button onClick={() => this.jumpToAfter(0)}>Go to game start</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
