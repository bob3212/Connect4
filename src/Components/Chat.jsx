import React, { useState, useRef, useEffect } from 'react';
import {Spinner, Button} from 'react-bootstrap'
import axios from 'axios'

export default function Chat(props) {
    /*
    this.state = {
        messages: []
    }
    */
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function getUser(){
            const user = await axios.get(`/users/`)
            setUser(user.data)
        }
        getUser();
    })

    // if(!user){
    //     return <Spinner animation="border" />;
    // }

    const input = useRef(null);
    
    function onClick(){
        props.sendMessage(input.current.value)
        input.current.value = null
    }
    return(
        <div className="chatArea">
            <p><b>Spectators:</b> {props.spectators.map(spectator => (<p>{spectator}</p>))}</p>
            {/* {props.spectators.map(spectator => (<p>{spectator}</p>))} */}
            <p><b>Players:</b> {props.player1}, {props.player2}</p>
            {props.messages.map(msg => (<p>{msg}</p>))}
            <input placeholder="Chat here!" ref={input} className="chatBox"/>
            <Button className="chatSubmit" onClick={onClick} >Submit</Button>
        </div>
    )
}
