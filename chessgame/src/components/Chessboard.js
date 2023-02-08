import "./Chessboard.css";
const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Chessboard() {
  let board = [];

  for (let x = 1; x <= 8; x++) {
    for (let y = 8; y >= 1; y--) {
      const tileClass = (x + y) % 2 === 0 ? "light" : "dark";
      board.push(
        <span className={tileClass} key={`${xAxis[x - 1]}${y}`}> {`${xAxis[x - 1]}${y}`}</span>
      );
    }
  }
  return <div className="board">{board}</div>;
}
