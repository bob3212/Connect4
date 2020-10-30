import React, {Component} from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {logoutUser} from "../actions/authAction"


class Dashboard extends React.Component{
    
    onLogoutClick=e=>{
        e.preventDefault();
        this.props.logoutUser();
    }

    render(){
        const {user} = this.props.auth
        return(
            <div>
                <div style={{ height: "75vh" }} className="container valign-wrapper">
                    <div className="row">
                        <div className="col s12 center-align">
                            <h4>
                            Welcome to Connect Four!
                            </h4>
                            <button
                                style={{
                                    width: "150px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                    marginTop: "1rem"
                                }}
                            onClick={this.onLogoutClick}
                            >
                            Logout
                            </button>
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