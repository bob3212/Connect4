import React from 'react';
import {Button} from 'react-bootstrap'

export default class CreateGame extends React.Component {
    state = {
        public: true,
        friendsonly: false,
        private: false
        // playerOne: undefined,
        // playerTwo: undefined
    }

    onClick = e => {
        e.preventDefault()
        //this.setState({public: })
    }
    render(){
        return (
            <div>
                <h1>Create a Game!</h1>
                <div>
                    <input type="radio" id="public" name="access"/>
                    <label htmlFor="public">Public</label><br/>
                    <input type="radio" id="friendsonly" name="access"/>
                    <label htmlFor="friendsonly">Friends only</label><br/>
                    <input type="radio" id="private" name="access"/>
                    <label htmlFor="private">Private</label><br/>
                </div>
                <Button onClick={this.onClick}>Create</Button>
            </div>
        )
    }
}