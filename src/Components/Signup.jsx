import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom'
//import { connect } from 'mongoose';
import { registerUser } from './../actions/authAction';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';


class Signup extends React.Component{
    constructor(){
        super();
        this.state = {
            name: "",
            username: "",
            password: "",
            errors: {}
        }
    }

    //if user is already logged in, go to dashboard
    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push("/dashboard")
        }
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    onChange=e=>{
        this.setState({ [e.target.id]: e.target.value})
    }

    onSubmit=e=>{
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password
        }
        this.props.registerUser(newUser, this.props.history)
    }
    render(){
        const {errors} = this.state
        return(
            <div>
                <div className="container">
                <Form noValidate onSubmit={this.onSubmit}>
                    <h2>
                        <b>Register</b> below
                    </h2>
                    <Link to="/" >Back to home</Link>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" id="name" onChange={this.onChange}
                        value={this.state.name} error={errors.name} className={classnames("", {invalid: errors.name})}/>
                        <span style="color: red">{errors.name}</span>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username" id="username" onChange={this.onChange}
                        value={this.state.username} error={errors.username} className={classnames("", {invalid: errors.username || errors.usernamenotfound})}/>
                        <span style="color: red">{errors.username}{errors.usernamenotfound}</span>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" id="password" onChange={this.onChange}
                        value={this.state.password} error={errors.password} className={classnames("", {invalid: errors.password || errors.passwordincorrect})}/>
                        <span style="color: red">{errors.password}{errors.passwordincorrect}</span>
                    </Form.Group>
                    <Button variant="primary" type="submit">Login</Button>
                </Form>
                    {/* <div className="row">
                        <div className="col s8 offset-s2">
                            <Link to="/" className="btn-flat waves-effect">
                                <i className="material-icons left">keyboard_backspace</i> Back to
                            home
                            </Link>
                            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                <h4>
                                    <b>Register</b> below
                                </h4>
                                <p className="grey-text text-darken-1">
                                    Already have an account? <Link to="/login">Log in</Link>
                                </p>
                            </div>
                            <form noValidate onSubmit={this.onSubmit}>
                                <div>
                                    <input
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    error={errors.name}
                                    id="name"
                                    type="text"
                                    className={classnames("", {invalid: errors.name})}
                                    />
                                    <label htmlFor="name">Name</label>
                                    <span className="red-text">{errors.name}</span>
                                </div>
                                <div>
                                    <input
                                    onChange={this.onChange}
                                    value={this.state.username}
                                    error={errors.username}
                                    id="username"
                                    type="text"
                                    className={classnames("", {invalid: errors.username})}
                                    />
                                    <label htmlFor="name">Username</label>
                                    <span className="red-text">{errors.username}</span>
                                </div>
                                <div>
                                    <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("", {invalid: errors.password})}
                                    />
                                    <label htmlFor="password">Password</label>
                                    <span className="red-text">{errors.password}</span>
                                </div>
                                <div style={{ paddingLeft: "11.250px" }}>
                                    <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                    >
                                    Sign up
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

Signup.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

export default connect(
    mapStateToProps,
    {registerUser}
)(withRouter(Signup));