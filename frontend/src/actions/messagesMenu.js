export const refreshMessagesMenuSuccess = (payload) => ({
    type: 'REFRESH_MESSAGES_MENU_SUCCESS',
    payload
});

export const refreshMessagesMenu = () => {
    return (dispatch) => {
        return dispatch(refreshMessagesMenuSuccess({time: new Date().getTime(), data: null}));
    }
};