import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios'

export default class FriendsList extends React.Component {
    state={
        user: "",
        friends: null,
        sentRequests: null
    }
    getUser() {
        return axios.get(`/users/`)
    }

    getFriends = async (userId) => {
        return (await axios.get(`/users/friends/${userId}`)).data
    }

    getSentRequests = async (userId) => {
        return (await axios.get(`/users/sentFriendRequests/${userId}`)).data
    }

    async componentDidMount(){
        this.setState({user: (await this.getUser()).data})
        this.setState({friends: await this.getFriends(this.state.user._id)})
        this.setState({sentRequests: await this.getSentRequests(this.state.user._id)})
    }
    
    render(){
        return(
            <div style={{position: 'fixed', right: 0, minHeight: '200px', minWidth: '300px'}}>
                
                <ListGroup as="ol">
                    <ListGroup.Item disabled variant="dark" as="ol">Pending Requests</ListGroup.Item>
                    {this.state.sentRequests && this.state.sentRequests.map(friendId => {
                        return (
                            <div>
                                <ListGroup.Item action variant="warning">{friendId.user1.username}</ListGroup.Item>
                            </div>
                        )
                    })}
                </ListGroup>
                <br />
                <ListGroup as="ol">
                    <ListGroup.Item disabled as="ol">Friends List </ListGroup.Item>
                    {this.state.friends && this.state.friends.map(friendId => {
                        return (
                            <div>
                                <ListGroup.Item variant={(friendId.user1.online) ? "success" : "dark"} onClick={() => window.location.href = `/UserProfile/${friendId.user1._id}`}>{friendId.user1.username}</ListGroup.Item>
                            </div>
                        )
                    })}
                </ListGroup>
            </div>
        )
    }

}