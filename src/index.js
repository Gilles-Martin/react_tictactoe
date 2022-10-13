import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={'square ' + props.pointer}
      onClick={props.onClick}
    >
      {props.value}
    </button >
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const showPointer = this.props.squares[i] === null ? 'pointer' : '';
    const victory = (this.props.winnerGrid) ? 'victory' : '';
    if (this.props.winnerGrid) {
      console.log(this.props.winnerGrid);
    }
    return <Square
      value={this.props.squares[i]}
      pointer={showPointer}
      victory={victory}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      winnerGrid: {},
      tieGame: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const score = calculateWinner(squares);
    if (score.winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext === true ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      winnerGrid: {},
      tieGame: 0,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const score = calculateWinner(current.squares);
    const winner = score.winner;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Revenir au tour n°' + move :
        'Revenir au début de la partie';
      const isBold = this.state.stepNumber === move ? 'bold' : '';
      return (
        <li key={move}>
          <button
            className={isBold}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner is ' + winner;
      /*
      this.setState({
        winnerGrid: score.winnerGrid,
      });*/
    } else {
      status = 'Next player: ' + (this.props.xIsNext === true ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
      const winnerGrid = { a, b, c }
      return { 'winner': squares[a], 'winnerGrid': winnerGrid };
    }
  }
  return { 'winner': null, 'winnerGrid': null };
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
