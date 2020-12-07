import React, { useRef } from 'react';
import {Button} from 'react-bootstrap'

export default function Chat(props) {

    const input = useRef(null);
    
    function onClick(){
        props.sendMessage(input.current.value)
        input.current.value = null
    }
    return(
        <div className="chatArea">
            <p><b>Spectators:</b> {props.spectators.map(spectator => (<p>{spectator}</p>))}</p>
            <p><b>Players:</b> {props.player1}, {props.player2}</p>
            {props.messages.map(msg => (<p>{msg}</p>))}
            <input placeholder="Chat here!" ref={input} className="chatBox"/>
            <Button className="chatSubmit" onClick={onClick} >Submit</Button>
        </div>
    )
}
