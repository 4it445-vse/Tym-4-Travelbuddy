import {combineReducers} from "redux";

const dummy = (state = 0, action) => {

    switch (action.type) {
        case 'DUMMY_ACTION':
            return state + 1;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    dummy,
});
