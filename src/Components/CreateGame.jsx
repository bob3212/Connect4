import React from 'react';
import {Button, ButtonGroup, ToggleButton, Spinner} from 'react-bootstrap'
import axios from 'axios';
import url from '../actions/authAction'


const radios = [
    { name: 'Public', value: '1' },
    { name: 'Private', value: '2' },
    { name: 'Friends-Only', value: '3' },
  ];
export default class CreateGame extends React.Component {
    state = {
        type: null,
        inQueue: false,
        currentUser: null
        
        // playerOne: undefined,
        // playerTwo: undefined
    }
    componentDidMount = async () => {
        this.setState({currentUser: (await this.getUser()).data})
    }

    getUser = async () => {
        return await axios.get(`${url}/users/`)
    }

    createGame = async (userId) => {
        return await axios.post(`${url}/games/queue`, {id: userId})
    }

    checkQueue = async () => {
        const newGame = await this.createGame(this.state.currentUser._id)
        console.log(newGame.data)
        if(newGame.data.game){
            window.location.href = `/game/${newGame.data.game}`
        }
    }

    onClick = e => {
        e.preventDefault()
        this.setState({inQueue: true})
        setInterval(this.checkQueue, 1000)
    }
    render(){
        return (
            <div>
                <h1>Create a Game!</h1>
                <ButtonGroup toggle>
                    {radios.map((radio, idx) => (
                        <ToggleButton 
                            disabled={this.state.inQueue}
                            key={idx}
                            type="radio"
                            variant="secondary"
                            name="radio"
                            value={radio.value}
                            checked={this.state.type === radio.value}
                            onChange={(e) => this.setState({type: e.currentTarget.value})}
                        >
                        {radio.name}
                        </ToggleButton>))}
                </ButtonGroup>
                <br />
                <br />
                <Button disabled={!this.state.type || this.state.inQueue || !this.state.currentUser} onClick={this.onClick}>Search{this.state.inQueue && <Spinner animation="border" size="sm" variant="light" />}</Button>
            </div>
        )
    }
}