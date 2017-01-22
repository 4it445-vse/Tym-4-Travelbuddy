import serverEvents from "./serverEvents"

const LOGIN_USER = 'LOGIN_USER';
export const logInUser = (data, rememberUser) => {
    console.log("login user: ", data);
    if(rememberUser === true){
        localStorage.setItem('user', JSON.stringify(data));
    }else{
        sessionStorage.setItem('user', JSON.stringify(data));
    }

    serverEvents.newMessage(data.id);

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
        console.log("Attemp to log out");
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        return dispatch(logOutUserSuccess());
    }
}

export const logOutUserSuccess = () => ({
    type: 'LOGOUT_USER_SUCCESS'
})
