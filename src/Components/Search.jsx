import React from 'react';
import { Form, Table } from 'react-bootstrap';
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
    }

    onChange=e=>{
        this.setState({[e.target.id]: e.target.value})
    }

    getUsers = (username) => {
        return axios.get(`${url}/users/search/${username}`)
    }

    addFriend = (userId) => {

    }

    showUsers = () => {
        return (
            <Table striped bordered hover variant="dark">
                <tbody>
                    {this.state.results.data && this.state.results.data.map(result => <tr onClick={(e) => window.location.href = `/UserProfile/${result._id}`}><th>{result.username}</th><th onClick={this.addFriend(result._id)}>Add Friend</th></tr>)}
                </tbody>
            </Table>
        )
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
                    <Button variant="primary" type="submit" disabled={!this.state.username}>Search</Button>
                </Form>
                <br />
                {this.showUsers()}
            </div>
        )
    }
}

export default Search