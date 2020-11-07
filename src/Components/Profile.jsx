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
            winPercentage: 0
        }
    }
    getUser() {
        return axios.get(`${url}/users/`)
    }

    getNumGames() {
        return this.state.user.gamesPlayed.length
    }

    getWinPercentage() {
        if(this.state.numGames){
            return this.state.numWins / this.state.numGames
        }else{
            return 0
        }
    }

    async componentDidMount(){
        const user1 = await this.getUser()
        this.setState({user: user1.data})
        this.setState({numGames: await this.getNumGames()})
    }
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
                        <ListGroup.Item>Win percentage</ListGroup.Item>
                    </ListGroup>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Opponent</th>
                                <th>Win/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mark</td>
                                <td>Win</td>
                            </tr>
                            <tr>
                                <td>Jacob</td>
                                <td>Win</td>
                            </tr>
                            <tr>
                                <td>Larry</td>
                                <td>Loss</td>
                            </tr>
                        </tbody>
                    </Table>
                    <FriendsList/>
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