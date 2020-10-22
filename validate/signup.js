const Validator = require("validator");
const isEmpty = require('is-empty');

module.exports = function validateSignupInput(data){
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    if(Validator.isEmpty(data.name)){
        errors.name = "Name is required"
    }
    if(Validator.isEmpty(data.username)){
        errors.username = "Username is required"
    }
    if(Validator.isEmpty(data.password)){
        errors.password = "Password is required"
    }
    if(!Validator.isLength(data.password, {min: 5, max: 30})){
        errors.password = "Password must be between 5-30 characters"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
