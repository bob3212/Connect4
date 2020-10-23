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
        console.log(userData)
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
                {/* <div style={{ marginTop: "4rem" }} className="row">
                    <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                                <i className="material-icons left">keyboard_backspace</i> Back to
                            home
                            </Link>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <h4>
                            <b>Login</b> below
                        </h4>
                        <p className="grey-text text-darken-1">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div>
                                <input
                                onChange={this.onChange}
                                value={this.state.username}
                                error={errors.username}
                                id="username"
                                type="text"
                                className={classnames("", {invalid: errors.username || errors.usernamenotfound})}
                                />
                                <label htmlFor="name">Username</label>
                                <span className="red-text">{errors.username}{errors.usernamenotfound}</span>
                            </div>
                            <div>
                                <input
                                onChange={this.onChange}
                                value={this.state.password}
                                error={errors.password}
                                id="password"
                                type="password"
                                className={classnames("", {invalid: errors.password || errors.passwordincorrect})}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">{errors.password}{errors.passwordincorrect}</span>
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
                                Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div> */}
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