import React, {Component} from 'react';
import Row from './Row';
import Chat from './Chat';
import io from 'socket.io-client'
import axios from 'axios'
import url from '../actions/authAction'

export default class Board extends Component{

    state = {
        player1: 1,
        player2: 2,
        gameOver: false,
        currentPlayer: null,
        board: [],
        messages: [],
        forfeited: false,
        opponent: null,
        winner: null,
        players: [],
        user: null,
        turn: null
    }

    //Initialize initial board state
    componentDidMount = async() => {
        let socket = io({query: `game=${this.props.match.params.id}`})
        socket.on('message', msg => {
            console.log(msg)
            this.setState({messages: [...this.state.messages, msg]})
        }) 
        socket.on('gameState', state => {
            // this.setState({board: state.newBoard, currentPlayer: state.curPlayer})
            this.setState({board: state})
        })
        socket.on('gameOver', state => {
            this.setState({gameOver: state.over, winner: state.result})
        })
        socket.on('turn', turn => {
            this.setState({turn})
        })
        this.sendMessage = message => {
            socket.emit("message", message)
        }
        this.setState({socket})
        let board=[];
        for(let row=0; row<6; row++){
            let row=[];
            for(let col=0; col<7; col++){
                row.push(null);
            }
            board.push(row);
        }
        this.setState({
            board,
            currentPlayer: this.state.player1,
            gameOver: false,
            forfeited: false,
            user: await this.getUser()
        })
        this.getOpponent()
        this.play = this.play.bind(this)
        console.log(this.state.user)
    }

    getUser = async () => {
        return (await axios.get(`${url}/users/`)).data
    }

    getOpponent = async () => {
        let game = (await axios.get(`${url}/games/${this.props.match.params.id}`)).data
        if(this.state.user._id === game.player1._id){
            this.setState({
                opponent: game.player2,
                currentPlayer: 1
            })
        }else{
            this.setState({
                opponent: game.player1,
                currentPlayer: 2
            })
        }
    }

    play(column){
        //check if valid move :)
        if(!this.state.gameOver){
            this.state.socket.emit('move', {currentPlayer: this.state.currentPlayer, col: column})
        }else{
            alert(`Game Over! ${this.state.winner.username} won!`)
        }
    }
    
    forfeitGame(){
        this.state.socket.emit('forfeit', isForfeit => console.log("USER HAS FORFEITED"))
        this.setState({
            gameOver: true,
            forfeited: true
        })
        alert("Player has forfeited the game")
    }

    render(){
        const header = this.state.winner ? `Game Over! ${this.state.winner.username} won!` : <>{this.state.turn === this.state.currentPlayer ? this.state.user && this.state.user.username : this.state.opponent && this.state.opponent.username}'s turn</>
        return (
            <div>
                <h1>Game Against: {this.state.opponent && this.state.opponent.username}</h1>
                <h1>{header}</h1>
                <table>
                        <tbody>
                            {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
                        </tbody>
                </table>
                <div className="forfeit-button" onClick={()=>this.forfeitGame()}>Forfeit</div>
                <Chat messages={this.state.messages} sendMessage={this.sendMessage}/>
                
            </div>
        )
    }
}