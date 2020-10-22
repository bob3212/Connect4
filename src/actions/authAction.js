import axios from "axios";
import setAuthToken from "../utilities/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types'

export const registerUser = (userData, history) => dispatch => {
    axios.post("/users/signup", userData).then(res=>history.push("/login")).catch(err=>dispatch({type: GET_ERRORS, payload: err.response.data}))
}

export const loginUser = userData => dispatch => {
    axios.post("users/login", userData).then(res=>{
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
    setAuthToken(false)
    dispatch(setCurrentUser({}))
}