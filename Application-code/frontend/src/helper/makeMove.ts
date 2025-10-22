import { Chess, Color, PieceSymbol, Square } from "chess.js";

export type moves = {
  san: string;
  color: Color | string;
  Piece : PieceSymbol | string;
  timeTaken: number;
}[][];

export type Movee = {
  san: string;
  color: Color | string;
  piece: PieceSymbol | string;
  timeTaken: number;
};

function makeMove(
  moves: moves,
  { san, color, piece, timeTaken }: Movee
) {
  
  if (moves.length !== 0) {
    if (moves[moves.length - 1].length % 2 === 0) {
      moves.push([{ san, color, Piece :  piece, timeTaken }]);
    } else {
      moves[moves.length - 1].push({
        san,
        color,
        Piece: piece,
        timeTaken,
      });
    }
  } else {
    moves.push([{ san, color, Piece : piece, timeTaken }]);
  }
}

export default makeMove;

export function isValidMove(
  { from, to }: { from: Square; to: Square },
  chess: Chess
) {
  const isvalid = chess
    .moves({
      verbose: true,
      square: from,
    })
    .map((move) => move.to)
    .includes(to);
  return isvalid;
}
