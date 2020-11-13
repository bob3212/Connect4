import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import FriendsList from './FriendsList';
import axios from 'axios'
import url from '../actions/authAction'

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
            games: null
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

    async componentDidMount(){
        const user1 = await this.getUser()
        this.setState({user: user1.data})
        this.setState({numGames: this.getNumGames()})
        this.setState({numWins: this.getNumWins()})
        this.setState({winPercentage: this.getWinPercentage()})
        this.setState({games: await this.getGames(this.state.user._id)})
    }
    showHistory = () => {
        return (
            <tbody>
                {/* {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)} */}
                {this.state.games && this.state.games.map(column => <tr><th onClick={(e) => window.location.href = `/UserProfile/${(this.state.user._id === column.player1._id) ? column.player2._id : column.player1._id}`}>{(this.state.user._id === column.player1._id) ? column.player2.username : column.player1.username}</th><th onClick={(e) => window.location.href = `/game/${column._doc._id}`}>{(column._doc.draw) ? "Draw": (this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)}
            </tbody>
        )
    }

    /* {(column._doc._draw) ? `Draw` : ((this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`)}
    {(this.state.user._id === column._doc.winner) ? `Win ${(column._doc.forfeited) ? "(forfeit)" : ""}` : `Loss ${(column._doc.forfeited) ? "(forfeit)" : ""}`} </th></tr>)} */

    render(){
        return(
            <div>
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
                    {/* <FriendsList/> */}
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