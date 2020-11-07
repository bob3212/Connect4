import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginUser} from '../actions/authAction';
import classnames from 'classnames';
import { Form, Button } from 'react-bootstrap';

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
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
        if(nextProps.auth.isAuthenticated){
            this.props.history.push("/dashboard") 
        }
        if(nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    onChange=e=>{
        this.setState({ [e.target.id]: e.target.value })
    }

    onSubmit=e=>{
        e.preventDefault();
        const userData = {
            username: this.state.username,
            password: this.state.password
        }
        this.props.loginUser(userData);
    }
    render(){
        const {errors} = this.state
        return(
            <div className="container">
                <Form noValidate onSubmit={this.onSubmit}>
                    <h2>
                        <b>Login</b> below
                    </h2>
                    <Link to="/" >Back to home</Link>
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
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
                    <Button variant="primary" type="submit">Login</Button>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

export default connect(
    mapStateToProps, 
    {loginUser}
)(Login)