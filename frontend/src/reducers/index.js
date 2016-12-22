import {combineReducers} from "redux";

const initialState = {
    email: 'email@domena.cz',
    firstname: 'Jan'
}

const user = (state = initialState, action) => {

    switch (action.type) {
        case 'CREATE_USER_SUCCESS':
            return {
                ...state,
                ...action.payload
            }
        case 'LOGIN_USER':
            return {
                ...state,
                ...action.payload
            }
        case 'LOGOUT_USER':
        default:
            return state;
    }
}


export const rootReducer = combineReducers({
    user,
});
