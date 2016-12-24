import {combineReducers} from "redux";

const initialState = (() => {
    let currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('user'));
    }
    return currentUser;

})();

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER_SUCCESS':
            return {
                ...state,
                ...action.payload
            }
        case 'LOGOUT_USER_SUCCESS':
            console.log('LOGOUT_USER_SUCCESS ', initialState);
            return null;
        default:
            return state;
    }
}

const initialStateModals = {};

const modals = (state = initialStateModals, action) => {

    switch (action.type) {
        case 'OPEN_LOGIN_SUCCESS':
        case 'OPEN_PROFILE_SUCCESS':
        case 'OPEN_CONTACT_BUDDY_SUCCESS':
        case 'OPEN_ALERT_SUCCESS':
        case 'OPEN_QUESTION_SUCCESS':
        case 'OPEN_REGISTRATION_SUCCESS':
        case 'OPEN_EDIT_PROFILE_SUCCESS':
        case 'OPEN_CREATE_REQUEST_SUCCESS':
        case 'OPEN_RESET_PASSWORD_SUCCESS':
        case 'OPEN_EDIT_REQUEST_SUCCESS':
            return {
                ...state,
                ...action.payload
            }
        case 'CLOSE_MODAL_SUCCESS':
            return initialStateModals;
        default:
            return state;
    }
}


export const rootReducer = combineReducers({
    user,
    modals
});
