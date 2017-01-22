import serverEvents from "./serverEvents"

const LOGIN_USER = 'LOGIN_USER';
export const logInUserSuccess = (payload) => ({
    type: 'LOGIN_USER_SUCCESS',
    payload
});

export const logInUser = (data, rememberUser) => {
    if(rememberUser === true){
        localStorage.setItem('user', JSON.stringify(data));
    }else{
        sessionStorage.setItem('user', JSON.stringify(data));
    }

    serverEvents.newMessage(data.id);

    return (dispatch) => {
        return dispatch(logInUserSuccess(data));
    }
};

export const logOutUserSuccess = () => ({
    type: 'LOGOUT_USER_SUCCESS'
});

export const logOutUser = () => {
    return (dispatch) => {
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        return dispatch(logOutUserSuccess());
    }
};