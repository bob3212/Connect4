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
        user: "",
        turn: null,
        playerOneName: "",
        playerTwoName: "",
        spectators: []
    }

    redirectIfFinished = async () => {
      const game = (await axios.get(`${url}/games/${this.props.match.params.id}`)).data
      if (!game.active) {
        window.location.href = `/replay/${this.props.match.params.id}`
      }
    }

    //Initialize initial board state
    componentDidMount = async() => {
        this.redirectIfFinished();
        this.setState({user: await this.getUser()})
        let socket = io({query: `game=${this.props.match.params.id}&id=${this.state.user._id}`})
        socket.on('message', msg => {
            console.log(msg)
            this.setState({messages: [...this.state.messages, msg]})
        }) 
        socket.on('gameState', state => {
            // this.setState({board: state.newBoard, currentPlayer: state.curPlayer})
            this.setState({board: state})
        })
        socket.on('gameOver', state => {
            this.setState({gameOver: state.over})
            if(state.result){
                this.setState({winner: state.result})
            }else{
                this.setState({winner: "draw"})
            }
        })
        socket.on('turn', turn => {
            this.setState({turn})
        })

        socket.on('spectators', spectators => {
            console.log(spectators)
            this.setState({spectators: [...this.state.spectators, spectators]})
        })
        console.log(this.state)

        socket.on('players', async players => {
            this.state.players.push(players.player1)
            this.state.players.push(players.player2)
            // this.setState({
            //     players: ["HI"]
            // })
            this.setState({
                
                playerOneName: await this.getPlayerUserName(this.state.players[0]),
                playerTwoName: await this.getPlayerUserName(this.state.players[1])
            })
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
            forfeited: false
        })
        this.getOpponent()
        this.play = this.play.bind(this)
        console.log(this.state)
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

    getPlayerUserName = async (userId) => {
        return (await axios.get(`${url}/users/${userId}`)).data.username
    }

    play(column){
        //check if valid move :)
        if(!this.state.gameOver){
            this.state.socket.emit('move', {currentPlayer: this.state.currentPlayer, col: column})
        }else{
            if(this.state.winner !== "draw"){
                alert(`Game Over! ${this.state.winner.username} won!`)
            }else{
                alert(`The game has ended in a draw!`)
            }
        }
    }
    
    forfeitGame(){
        console.log(this.state.user)
        this.state.socket.emit('forfeit', {loser: this.state.user})
        alert("Player has forfeited the game")
    }

    render(){
        let header;
        if(this.state.winner){
            if(this.state.winner === "draw"){
                header = "Game ended in a draw!"
            }else{
                header = `Game Over! ${this.state.winner.username} won!`
            }
        }else{
            let p1, p2;
            if(this.state.opponent){
                if(this.state.opponent.username === this.state.playerOneName){
                    p1 = this.state.playerOneName
                    p2 = this.state.playerTwoName
                }else{
                    p1 = this.state.playerTwoName
                    p2 = this.state.playerOneName
                }
                header = (this.state.turn === this.state.currentPlayer) ? <>{p2}'s turn</> : <>{p1}'s turn</>
            }
        }

        let spectatorHeader;
        if(this.state.players.includes(this.state.user._id)){
            spectatorHeader = `Game Against: ${this.state.opponent && this.state.opponent.username}`
        }else{
            spectatorHeader = `Watching: ${this.state.playerOneName} vs ${this.state.playerTwoName}`
        }

        return (
            <div disabled = {!this.state.gameOver && this.state.players.includes(this.state.user._id)}>
                <h1>{spectatorHeader}</h1>
                <h1>{header}</h1>
                <table>
                        <tbody disabled={!this.state.gameOver && this.state.players.includes(this.state.user._id)}>
                            {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
                        </tbody>
                </table>
                {!this.state.winner && <div className="forfeit-button" onClick={()=>this.forfeitGame()}>Forfeit</div>}
                <Chat messages={this.state.messages} sendMessage={this.sendMessage} player1={this.state.playerOneName} player2={this.state.playerTwoName} spectators={this.state.spectators}/>
                
            </div>
        )
    }
}
