import React, {useEffect, useState} from "react";
import axios from "axios";
import {Spinner, Button} from "react-bootstrap";
import Row from './Row'

const initialBoard = new Array(6).fill(null).map(() => new Array(7).fill(null))

export function Replay({match: {params: {id}}}) {
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    async function getGame() {
      const req = await axios.get(`/games/${id}`)
      
      setGame(req.data)
      console.log(req.data)
    }

    getGame();
  }, [id])

  if (!game) {
    return <Spinner animation="border" />;
  }

  function nextTurn() {
    const column = Number(game.turns[turn]);
    for(let i=5; i>=0; i--){
      if(board[i][column] === null){
        board[i][column] = turn % 2 + 1;
        break;
      }
    }

    setBoard([...board]);
    setTurn(turn+1);
  }

  function prevTurn() {
    const column = Number(game.turns[turn-1]);
    for(let i=0; i<6; i++){
      if(board[i][column] !== null){
        board[i][column] = null;
        break;
      }
    }

    setBoard([...board]);
    setTurn(turn-1);
  }

  function getWinnerUsername() {
    const id = game.winner;

    if (game.player1._id === id) {
      return game.player1.username;
    }

    if (game.player2._id === id) {
      return game.player2.username;
    }

    return "Unknown";
  }

  return (
    <>
      <h1>Turn: {turn}</h1>
      {turn >= game.turns.length && <h1>Winner: {getWinnerUsername()}</h1>}
      <table disabled>
              <tbody>
                  {board.map((row, i) => (<Row key={i} row={row} play={() => {}}/>))}
              </tbody>
      </table>

      <Button style={{margin: "10px 5px"}} disabled={turn === 0} onClick={prevTurn}>{"Previous Turn"}</Button>
      <Button style={{margin: "10px 5px"}} disabled={turn >= game.turns.length} onClick={nextTurn}>{"Next Turn"}</Button>
    </>
  )
}
