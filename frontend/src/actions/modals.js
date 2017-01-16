export const openLoginSuccess = (payload) => ({
    type: 'OPEN_LOGIN_SUCCESS',
    payload
})

export const openLogin = (data) => {
    return (dispatch) => {
        return dispatch(openLoginSuccess({modal: 'openLogin', data: null}));
    }
}

export const openRegistrationSuccess = (payload) => ({
    type: 'OPEN_REGISTRATION_SUCCESS',
    payload
})

export const openRegistration = (data) => {
    return (dispatch) => {
        return dispatch(openRegistrationSuccess({modal: 'openRegistration', data: null}));
    }
}

export const openProfileSuccess = (payload) => ({
    type: 'OPEN_PROFILE_SUCCESS',
    payload
})

export const openProfile = (data) => {
    return (dispatch) => {
        return dispatch(openProfileSuccess({modal: 'openProfile', data: data}));
    }
}

export const openMeetUpSuccess = (payload) => ({
    type: 'OPEN_PROFILE_SUCCESS',
    payload
})

export const openMeetUp = (data) => {
    return (dispatch) => {
        return dispatch(openMeetUpSuccess({modal: 'openShowMeetUp', data: data}));
    }
}

export const openContactBuddySuccess = (payload) => ({
    type: 'OPEN_CONTACT_BUDDY_SUCCESS',
    payload
})

export const openContactBuddy = (data) => {
    return (dispatch) => {
        return dispatch(openContactBuddySuccess({modal: 'openContactBuddy', data: data}));
    }
}

export const openNewMeetUpSuccess = (payload) => ({
    type: 'OPEN_NEW_MEET_UP_SUCCESS',
    payload
})

export const openNewMeetUp = (data) => {
    return (dispatch) => {
        return dispatch(openNewMeetUpSuccess({modal: 'openNewMeetUp', data: data}));
    }
}

export const openAlertSuccess = (payload) => ({
    type: 'OPEN_ALERT_SUCCESS',
    payload
})

export const openAlert = (data) => {
    return (dispatch) => {
        return dispatch(openAlertSuccess({modal: 'alert', data: data}));
    }
}

export const openQuestionSuccess = (payload) => ({
    type: 'OPEN_QUESTION_SUCCESS',
    payload
})

export const openQuestion = (data) => {
    return (dispatch) => {
        return dispatch(openQuestionSuccess({modal: 'question', data: data}));
    }
}

export const openEditProfileSuccess = (payload) => ({
    type: 'OPEN_EDIT_PROFILE_SUCCESS',
    payload
})

export const openEditProfile = () => {
    return (dispatch) => {
        return dispatch(openEditProfileSuccess({modal: 'openEditProfile', data: null}));
    }
}

export const openCreateRequestSuccess = (payload) => ({
    type: 'OPEN_CREATE_REQUEST_SUCCESS',
    payload
})

export const openCreateRequest = () => {
    return (dispatch) => {
        return dispatch(openCreateRequestSuccess({modal: 'openCreateRequest', data: null}));
    }
}

export const openResetPasswordSuccess = (payload) => ({
    type: 'OPEN_RESET_PASSWORD_SUCCESS',
    payload
})

export const openResetPassword = () => {
    return (dispatch) => {
        return dispatch(openResetPasswordSuccess({modal: 'openResetPassword', data: null}));
    }
}

export const openEditRequestSuccess = (payload) => ({
    type: 'OPEN_EDIT_REQUEST_SUCCESS',
    payload
})

export const openEditRequest = () => {
    return (dispatch) => {
        return dispatch(openEditRequestSuccess({modal: 'openEditRequest', data: null}));
    }
}

export const closeModalSuccess = (payload) => ({
    type: 'CLOSE_MODAL_SUCCESS',
    payload
})

export const closeModal = () => {
    return (dispatch) => {
        return dispatch(closeModalSuccess({}));
    }
}