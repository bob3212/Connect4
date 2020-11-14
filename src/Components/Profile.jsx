import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import FriendsList from './FriendsList';
import axios from 'axios'
import url from '../actions/authAction'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'

// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// import {getUser} from '../actions/authAction'
// import classnames from 'classnames'

class Profile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: "",
            numGames: 0,
            numWins: 0,
            winPercentage: 0,
            games: null,
            friendRequests: null
        }
    }
    
    getUser() {
        return axios.get(`${url}/users/`)
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
            let winPer = this.state.user.numWins / this.state.numGames * 100
            return winPer.toFixed(2)
        }else{
            return 0
        }
    }

    getFriendRequests = async() => {
        return (await axios.get(`${url}/users/incomingFriendRequests/${this.state.user._id}`)).data
    }

    acceptFriendRequest = async (userId) => {
        axios.post(`${url}/users/acceptFriend`, {id: userId})
    }

    rejectFriendRequest = async (userId) => {
        axios.post(`${url}/users/rejectFriend`, {id: userId})
    }

    async componentDidMount(){
        const user1 = await this.getUser()
        this.setState({user: user1.data})
        this.setState({numGames: this.getNumGames()})
        this.setState({numWins: this.getNumWins()})
        this.setState({winPercentage: this.getWinPercentage()})
        this.setState({games: await this.getGames(this.state.user._id)})
        this.setState({friendRequests: await this.getFriendRequests()})
    }
    showHistory = () => {
        return (
            <tbody>
                {/* {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)} */}
                {/* {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(column._doc.draw) ? "Draw": (this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)} */}
                {this.state.games && this.state.games.map(game => {
                    return (
                        <tr>
                            <th onClick={() => window.location.href = `/UserProfile/${(this.state.user._id === game.player1._id) ? game.player2._id : game.player1._id}`}>{(this.state.user._id === game.player1._id) ? game.player2.username : game.player1.username}</th>
                            <th onClick={() => window.location.href = `/game/${game._doc._id}`}>{(game._doc.draw) ? "Draw": (this.state.user._id === game._doc.winner) ? `Win ${(game._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(game._doc.forfeited) ? "(forfeit)" : ""}`} </th>
                        </tr>
                    )
                })}
            </tbody>
        )
    }
    showFriendRequests = () => {
        console.log(this.state.friendRequests)
        return (
            <div style={{position: 'fixed', minHeight: '200px'}}>
                {/* {this.state.friendRequests && this.state.friendRequests.map(request => <Toast><Toast.Header>Incoming Friend Request!</Toast.Header><Toast.Body>{request.user1.username} has sent you a friend request!</Toast.Body><Button variant="success" onClick={() => this.acceptFriendRequest(request.user1._id)}>Accept</Button><Button variant="danger" onClick={() => this.rejectFriendRequest(request.user1._id)}>Decline</Button></Toast>)} */}
                {/* {this.state.friendRequests && this.state.friendRequests.map(request => <div><Toast.Header>Incoming Friend Request!</Toast.Header>{this.state.user.username} has sent you a friend request!<Toast.Body></Toast.Body></div>)} */}
                {this.state.friendRequests && this.state.friendRequests.map(request => {
                    return (
                        <Toast>
                            <Toast.Header>Incoming Friend Request!</Toast.Header>
                            <Toast.Body>{request.user1.username} has sent you a friend request!</Toast.Body>
                            <Button variant="success" onClick={() => this.acceptFriendRequest(request.user1._id)}>Accept</Button>
                            <Button variant="danger" onClick={() => this.rejectFriendRequest(request.user1._id)}>Decline</Button>
                        </Toast>
                    )
                })}
            </div>
        )
    }

    /* {(column._doc._draw) ? `Draw` : ((this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`)}
    {(this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)} */

    render(){
        return(
            <div>
                {this.showFriendRequests()}
                <FriendsList />
                <Container>
                    <h1>Hello {this.state.user.username}</h1>
                    <form>
                        <input type="checkbox"></input>
                        <label>Public</label>
                    </form>
                    <ListGroup>
                        <ListGroup.Item>Total Number of Games Played: {this.state.numGames}</ListGroup.Item>
                        <ListGroup.Item>Win percentage: {this.state.winPercentage}%</ListGroup.Item>
                    </ListGroup>
                    <br />
                    <h2>Your match history</h2>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Opponent</th>
                                <th>Win/Loss</th>
                            </tr>
                        </thead>
                        {this.showHistory()}
                    </Table>
                </Container>
            </div>
        )
    }
}


// const mapStateToProps = state => ({
//     auth: state.auth,
//     errors: state.errors
// })

// Profile.propTypes = {
//     getUser: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired,
//     errors: PropTypes.object.isRequired
// }

// export default connect(
//     mapStateToProps, 
//     {getUser}
// )(Profile)
export default Profile