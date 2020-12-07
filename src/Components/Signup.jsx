import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Link, withRouter} from 'react-router-dom'
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

    //if user is already logged in, go to profile
    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push("/profile")
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
                        <span>{errors.name}</span>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username" id="username" onChange={this.onChange}
                        value={this.state.username} error={errors.username} className={classnames("", {invalid: errors.username || errors.usernamenotfound})}/>
                        <span>{errors.username}{errors.usernamenotfound}</span>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" id="password" onChange={this.onChange}
                        value={this.state.password} error={errors.password} className={classnames("", {invalid: errors.password || errors.passwordincorrect})}/>
                        <span>{errors.password}{errors.passwordincorrect}</span>
                    </Form.Group>
                    <Button variant="primary" type="submit">Register</Button>
                </Form>
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