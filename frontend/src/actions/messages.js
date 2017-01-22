export const refreshMessagesSuccess = (payload) => ({
    type: 'REFRESH_MESSAGES_SUCCESS',
    payload
});

export const refreshMessages = (data) => {
    return (dispatch) => {
        return dispatch(refreshMessagesSuccess({time: new Date().getTime(), data: data}));
    }
};