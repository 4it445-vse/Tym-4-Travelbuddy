import {combineReducers} from "redux";
import {browserHistory} from "react-router";
import serverEvents from "../actions/serverEvents";

const initialState = (() => {
    let currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('user'));
    }

    if(currentUser) serverEvents.newMessage(currentUser.id, messages);

    return currentUser;

})();

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER_SUCCESS':
        case 'UPDATE_USER_SUCCESS':
            return {
                ...state,
                ...action.payload
            };
        case 'LOGOUT_USER_SUCCESS':
            browserHistory.push("/");
            return null;
        default:
            return state;
    }
};

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
        case 'OPEN_NEW_MEET_UP_SUCCESS':
        case 'OPEN_SHOW_REQUEST_DETAILS_SUCCESS':
            return {
                ...state,
                ...action.payload
            };
        case 'CLOSE_MODAL_SUCCESS':
            return initialStateModals;
        default:
            return state;
    }
};

const initialStateMessages = {};

const messages = (state = initialStateMessages, action) => {

    switch (action.type) {
        case 'REFRESH_MESSAGES_SUCCESS':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

const messagesMenu = (state = initialStateMessages, action) => {

    switch (action.type) {
        case 'REFRESH_MESSAGES_MENU_SUCCESS':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

const reloadRequests = (state = initialStateMessages, action) => {

    switch (action.type) {
        case 'REFRESH_REQUESTS_SUCCESS':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

const initialStateRequestNotification = {
    countBuddy: 0,
    countTraveller:0
};

const requestNotification = (state = initialStateRequestNotification, action) => {

    switch (action.type) {
        case 'UPDATE_REQUEST_NOTIFICATION_COUNT_SUCCESS':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export const rootReducer = combineReducers({
    user,
    modals,
    messages,
    messagesMenu,
    reloadRequests,
    requestNotification
});
