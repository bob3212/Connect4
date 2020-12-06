import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import axios from 'axios'
import url from '../actions/authAction'


export default class Games extends React.Component {
    state = {
        user: null,
        results: []
    }

    componentDidMount = async () => {
        this.setState({
            user: (await this.getUser()).data
        })
        console.log(this.state)
        console.log(this.state.user._id)
        this.setState({results: await this.getActiveGames(this.state.user._id)})
        console.log(this.state)
        // this.showGames()
    }

    getUser = async () => {
        return await axios.get(`${url}/users/`)
    }

    getActiveGames = async (userId) => {
        return (await axios.get(`${url}/games/activeGames/${userId}`)).data
    }

    showGames = () => {
        return (
            <tbody>
                {/* {this.state.results.map(column => <tr onClick={(e) => window.location.href = `/game/${column._id}`}><th>{column._id}</th><th>{(this.state.user._id === column.currentPlayer) ? "Opponent's turn" : "Your turn"}</th></tr>)} */}
                {this.state.results.map(game => {
                    return (
                        <tr onClick={() => window.location.href = `/game/${game._id}`}>
                            <th>{game._id}</th>
                            <th>{(this.state.user._id === game.currentPlayer) ? "Your turn" : "Opponent's turn"}</th>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render(){
            return(
            <div>
                <Container>
                    <h1>Here are your active games</h1>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Game ID</th>
                                <th>Turn</th>
                            </tr>
                        </thead>
                        {this.showGames()}
                    </Table>
                </Container>
            </div>
        )
    }
    
}