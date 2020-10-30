import React from 'react';
import {Button} from 'react-bootstrap'
import {useRef} from 'react'

export default function Chat(props) {
    /*
    this.state = {
        messages: []
    }
    */
    const input = useRef(null);
    
    function onClick(){
        props.sendMessage(input.current.value)
        input.current.value = null
    }
    return(
        <div>
            {props.messages.map(msg => (<p>{msg}</p>))}
            <input placeholder="Chat here!" ref={input} className="chatBox"/>
            <Button onClick={onClick} >Submit</Button>
        </div>
    )
}