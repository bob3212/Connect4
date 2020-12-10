import axios from "axios";
import setAuthToken from "../utilities/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types'

const url = "http://localhost:8080"
export default url

export const registerUser = (userData, history) => dispatch => {
    axios.post(`${url}/users/signup`, userData).then(res=>history.push("/login")).catch(err=>dispatch({type: GET_ERRORS, payload: err.response.data}))
}

export const loginUser = userData => dispatch => {
    axios.post(`${url}/users/login`, userData).then(res=>{
        const {token} = res.data
        localStorage.setItem("jwtToken", token)
        setAuthToken(token)
        const decode = jwt_decode(token)
        dispatch(setCurrentUser(decode))
    }).catch(err=>dispatch({type: GET_ERRORS, payload: err.response.data}))
}

export const setCurrentUser = decode => {
    return {type: SET_CURRENT_USER, payload: decode}
}

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    }
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken")
    //remove auth header for future requests
    setAuthToken(false)
    //set current user to an empty object which will set isAuthenticated to false
    dispatch(setCurrentUser({}))
}
