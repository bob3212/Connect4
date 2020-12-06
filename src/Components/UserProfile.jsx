import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import axios from 'axios'
import url from '../actions/authAction'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// import {getUser} from '../actions/authAction'
// import classnames from 'classnames'

class UserProfile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: "",
            numGames: 0,
            numWins: 0,
            winPercentage: 0,
            games: null,
            activeGames: [],
            accessingUser: "",
            isFriends: false,
            friends: null
        }
    }
    getUser() {
        const userId = this.props.match.params.id
        return axios.get(`${url}/users/${userId}`)
    }

    getAccessingUser() {
        return axios.get(`${url}/users/`)
    }

    getFriends = async (userId) => {
        return (await axios.get(`${url}/users/friends/${userId}`)).data
    }

    isFriends() {
        if(this.state.accessingUser.friends.includes(this.state.user._id)){
            this.setState({isFriends: true})
        }
    }

    getGames = async (userId) => {
        // return (await axios.get(`${url}/games/allGames/${userId}`)).data
        
        let games = (await axios.get(`${url}/games/allGames/${userId}`)).data
        let viewableGames = []

        for(let i = 0; i < games.length; i++){
            if(await this.checkAccess(games[i].$__._id)){
                viewableGames.push(games[i])
            }
        }
        return viewableGames
    }

    getNumGames() {
        return this.state.user.gamesPlayed.length
    }
    
    getNumWins() {
        return this.state.user.numWins
    }

    getWinPercentage() {
        if(this.state.numGames && this.state.user.numWins){
            let winPer =  this.state.user.numWins / this.state.numGames * 100
            return winPer.toFixed(2)
        }else{
            return 0
        }
    }

    getActiveGames = async (userId) => {
        let games = (await axios.get(`${url}/games/activeGames/${userId}`)).data
        let viewableGames = []
        for(let i = 0; i < games.length; i++){
            if(await this.checkAccess(games[i]._id)){
                viewableGames.push(games[i])
            }
        }
        return viewableGames
    }

    removeFriend = async (userId) => {
        await axios.post(`${url}/users/removeFriend`, {id: userId})
        this.setState({isFriends: false})
    }

    addFriend = async (userId) => {
        await axios.post(`${url}/users/requestFriend`, {id: userId})
        // this.setState({isFriends: true})
    }

    checkAccess = async (gameId) => {
        let game = (await axios.get(`${url}/games/${gameId}`)).data
        if(game.type === "public"){ //Public Game
            return true
        }else if(game.type === "private"){ //Private Game
            if(this.state.accessingUser._id === game.player1._id || this.state.accessingUser._id === game.player2._id){
                return true
            }
            return false
        }else{ //Friends only game
            if(this.state.accessingUser.friends.includes(game.player1._id) || this.state.accessingUser.friends.includes(game.player2._id)){
                return true
            }
            return false
        }
    }

    async componentDidMount(){
        this.setState({user: (await this.getUser()).data})
        this.setState({numGames: this.getNumGames()})
        this.setState({numWins: this.getNumWins()})
        this.setState({winPercentage: this.getWinPercentage()})
        this.setState({accessingUser: (await this.getAccessingUser()).data})
        this.setState({friends: await this.getFriends(this.state.user._id)})
        this.isFriends()
        this.setState({games: await this.getGames(this.state.user._id)})
        this.setState({activeGames: await this.getActiveGames(this.state.user._id)})
    }
    showHistory = () => {
        return (
            <tbody>
                {this.state.games && this.state.games.reverse().map(game => {
                    let opponent = (this.state.user._id === game.player1._id) ? game.player2 : game.player1
                    if(!opponent.public && !this.state.accessingUser.friends.includes(opponent._id)){
                        return (
                            <tr>
                                {/* <th onClick={() => window.location.href = `/UserProfile/${(this.state.user._id === game.player1._id) ? game.player2._id : game.player1._id}`}>{(this.state.user._id === game.player1._id) ? game.player2.username : game.player1.username}</th> */}
                                <th>{(this.state.user._id === game.player1._id) ? game.player2.username : game.player1.username}</th>
                                <th onClick={() => window.location.href = `/replay/${game._doc._id}`}>{(game._doc.draw) ? "Draw": (this.state.user._id === game._doc.winner) ? `Win ${(game._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(game._doc.forfeited) ? "(forfeit)" : ""}`} </th>
                                <th onClick={() => window.location.href = `/replay/${game._doc._id}`}>{<a href={`/replay/${game._doc._id}`}>Replay</a>} </th>
                            </tr>
                        )
                    }
                    return (
                        <tr>
                            <th onClick={() => window.location.href = `/UserProfile/${(this.state.user._id === game.player1._id) ? game.player2._id : game.player1._id}`}>{(this.state.user._id === game.player1._id) ? game.player2.username : game.player1.username}</th>
                            <th onClick={() => window.location.href = `/replay/${game._doc._id}`}>{(game._doc.draw) ? "Draw": (this.state.user._id === game._doc.winner) ? `Win ${(game._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(game._doc.forfeited) ? "(forfeit)" : ""}`} </th>
                            <th onClick={() => window.location.href = `/replay/${game._doc._id}`}>{<a href={`/replay/${game._doc._id}`}>Replay</a>} </th>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    showGames = () => {
        return (
            <tbody>
                {this.state.activeGames.map(game => {
                    return (
                        <tr onClick={() => window.location.href = `/game/${game._id}`}>
                            <th>{game._id}</th>
                            <th>{(this.state.user._id === game.currentPlayer) ? `${this.state.user.username}'s turn` : `Opponent's turn`}</th>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    showButton = () => {
        // let temp = this.state.isFriends ? "Remove Friend" : "Add Friend"
        let temp
        if(this.state.isFriends){
            temp = "Remove Friend"
        }else if(this.state.accessingUser && this.state.accessingUser.sentFriendRequests.includes(this.state.user._id)){
            temp = "Request Pending"
        }else{
            temp = "Add Friend"
        }
        return (
            <div>
                {/* <Button onClick={() => this.removeFriend(this.state.user._id)}>
                    {(temp === "Remove Friend") ? "Remove Friend" : "Add Friend"}
                </Button> */}
                {/* <Button onClick={() => (temp === "Remove Friend") ? this.removeFriend(this.state.user._id) : this.addFriend(this.state.user._id)}>
                    {(temp === "Remove Friend") ? "Remove Friend" : "Add Friend"}
                </Button> */}
                <Button onClick={() => (temp === "Remove Friend") ? this.removeFriend(this.state.user._id) : this.addFriend(this.state.user._id)}>
                    {temp}
                </Button>
            </div>
        )
    }

    render(){
        return(
            <div>
                <Container>
                    <h1>Viewing {this.state.user.username}'s Profile</h1>
                    <ListGroup>
                        <ListGroup.Item>Total Number of Games Played: {this.state.numGames}</ListGroup.Item>
                        <ListGroup.Item>Win percentage: {this.state.winPercentage}%</ListGroup.Item>
                    </ListGroup>
                    <br />
                    {this.showButton()}
                    <br />
                    <Row>
                        <Col>
                            <h2>Active Games</h2>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Game ID</th>
                                        <th>Turn</th>
                                    </tr>
                                </thead>
                                {this.showGames()}
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Match History</h2>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>Opponent</th>
                                        <th>Win/Loss</th>
                                    </tr>
                                </thead>
                                {this.showHistory()}
                            </Table>
                        </Col>
                    </Row>
                    {/* <br /> */}
                </Container>
            </div>
        )
    }
}

export default UserProfile
