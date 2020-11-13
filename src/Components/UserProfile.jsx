import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import axios from 'axios'
import url from '../actions/authAction'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

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
            activeGames: []
        }
    }
    getUser() {
        const userId = this.props.match.params.id
        return axios.get(`${url}/users/${userId}`)
    }

    getGames = async (userId) => {
        return (await axios.get(`${url}/games/allGames/${userId}`)).data
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
        return (await axios.get(`${url}/games/activeGames/${userId}`)).data
    }

    async componentDidMount(){
        const user1 = await this.getUser()
        this.setState({user: user1.data})
        this.setState({numGames: this.getNumGames()})
        this.setState({numWins: this.getNumWins()})
        this.setState({winPercentage: this.getWinPercentage()})
        this.setState({games: await this.getGames(this.state.user._id)})
        this.setState({activeGames: await this.getActiveGames(this.state.user._id)})
    }
    showHistory = () => {
        console.log(this.state.games)
        return (
            <tbody>
                {/* {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(this.state.user._id === column._doc.winner) ? "Win" : "Loss"}</th></tr>)} */}
                {/* {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)} */}
                {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(column._doc.draw) ? "Draw": (this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)}
            </tbody>
        )
    }

    showGames = () => {
        return (
            <tbody>
                {this.state.activeGames.map(column => <tr onClick={(e) => window.location.href = `/game/${column._id}`}><th>{column._id}</th><th>{(this.state.user._id === column.currentPlayer) ? "Opponent's turn" : `${this.state.user.username}'s turn`}</th></tr>)}
            </tbody>
        )
    }

    render(){
        return(
            <div>
                <Container>
                    <h1>{this.state.user.username}'s Profile</h1>
                    <ListGroup>
                        <ListGroup.Item>Total Number of Games Played: {this.state.numGames}</ListGroup.Item>
                        <ListGroup.Item>Win percentage: {this.state.winPercentage}%</ListGroup.Item>
                    </ListGroup>
                    {/* <br /> */}
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