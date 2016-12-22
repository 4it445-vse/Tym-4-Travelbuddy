import axios from "../api";


const CREATE_USER = 'CREATE_USER';
export const createUser = (data) => {
    console.log(data);

    return (dispatch) => {
        return axios.post('buddies', {
            "email": data.email,
            "password": data.pass,
            "sex": "na",
            "name": data.name,
            "surname": data.surname,
            "city": data.city,
            "is_hosting": false

        }).then(response => {
            console.log(response);
            dispatch(createUserSuccess(response.data[0]))
        });
    }
}

export const createUserSuccess = (payload) => ({
    type: 'CREATE_USER_SUCCESS',
    payload
})


const LOGIN_USER = 'LOGIN_USER';
export const logInUser = (data) => {
    console.log(data);

    return (dispatch) => {
        return dispatch(logInUserSuccess(data));
    }
}

export const logInUserSuccess = (payload) => ({
    type: 'LOGIN_USER_SUCCESS',
    payload
})


const LOGOUT_USER = 'LOGOUT_USER';
export const logOutUser = () => {
    return (dispatch) => {
        return dispatch(logOutUserSuccess());
    }
}

export const logOutUserSuccess = () => ({
    type: 'LOGOUT_USER_SUCCESS'
})