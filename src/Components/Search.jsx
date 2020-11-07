import React from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import url from '../actions/authAction'
//import {Link} from 'react-router-dom'

class Search extends React.Component {
    constructor(){
        super()
        this.state = {
            username: "",
            errors: {},
            results: []
        }
    }

    onSubmit= async e=>{
        e.preventDefault();
        let results1 = await this.getUsers(this.state.username)
        this.setState({results: results1})
        this.showUsers()
    }

    onChange=e=>{
        this.setState({[e.target.id]: e.target.value})
    }

    getUsers = (username) => {
        return axios.get(`${url}/users/search/${username}`)
    }

    showUsers = () => {
        let numResults = this.state.results.data.length
        let ListGroup = document.querySelector("ul")
        for(let i=0; i<numResults; i++){
            let user = this.state.results.data[i]
            let listItem = document.createElement("li")
            listItem.textContent = user.username
            ListGroup.appendChild(listItem)
        }
    }

    render(){
        const {errors} = this.state
        return(
            <div className="container">
                <Form onSubmit={this.onSubmit}>
                    <h2>Search for usernames below</h2>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Enter Username" id="username" onChange={this.onChange}
                        value={this.state.username} error={errors.username}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">Search</Button>
                </Form>
                <ul>

                </ul>
                {/* <ListGroup>
                    <ListGroup.Item action href="/">
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={this.onClick}>
                    This one is a button
                    </ListGroup.Item>
                </ListGroup> */}
            </div>
        )
    }
}

export default Search