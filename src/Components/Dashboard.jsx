import React from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {logoutUser} from "../actions/authAction"
import {Link} from 'react-router-dom'

import axios from 'axios';
import url from '../actions/authAction'

class Dashboard extends React.Component{

    state = {
        user: ""
    }

    getUser() {
        return axios.get(`${url}/users/`)
    }

    logOut = async (userId) => {
        axios.post(`${url}/users/logout`, {id: userId})
    }
    
    onLogoutClick=async (e)=>{
        e.preventDefault();
        await this.logOut(this.state.user._id)
        this.props.logoutUser()
    }

    async componentDidMount(){
        const user1 = (await this.getUser()).data
        this.setState({user: user1})
        console.log(this.state)
    }

    render(){
        return(
            <div>
                <div style={{ height: "75vh" }} className="container valign-wrapper">
                    <div className="row">
                        <div className="col s12 center-align">
                            <h4>
                            Welcome to Connect Four!
                            </h4>
                            <button onClick={this.onLogoutClick}>Logout</button>
                            <Link to="/creategame">Start a game</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(
    mapStateToProps,
    {logoutUser}
)(Dashboard)